import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '@/backend/models/User';
import bcrypt from 'bcrypt';
import { signJwtToken } from '@/lib/jwt';
import dbConnect from '@/lib/db';

export const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      type: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'Enter your user name',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: ' Enter your password',
        },
      },

      async authorize(credentials, req) {
        const { email, password } = credentials;

        await dbConnect();
        const user = await User?.findOne({ email }).select('+password');

        if (!user) {
          throw new Error('Invalid email or password');
        }

        const comparePass = await bcrypt.compare(password, user.password);

        if (!comparePass) {
          throw new Error('Invalid email or password');
        } else {
          const { password, ...currentUser } = user._doc;
          const accessToken = signJwtToken(currentUser, { expiresIn: '6d' });
          return {
            ...currentUser,
            accessToken,
          };
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider == 'credentials') {
        return true;
      }
      if (account?.provider == 'google') {
        await dbConnect();
        try {
          const existinguser = await User?.findOne({ email: user.email });
          if (!existinguser) {
            const newUser = new User({
              email: user.email,
              username: user.name,
            });

            await newUser.save();
            return true;
          }
          return true;
        } catch (error) {
          console.log('error saving google user', error);
          return false;
        }
      }
    },
    async jwt({ token, user, account }) {
      if (account?.provider == 'google') {
        if (user) {
          const existinguser = await User?.findOne({ email: user.email });
          const currentUser = {
            avatar: { url: user.image },
            _id: existinguser._id,
            name: user.name,
            email: user.email,
            role: existinguser.role,
            createdAt: existinguser.createdAt,
            updatedAt: existinguser.updatedAt,
            accessToken: account.access_token,
          };

          token.accessToken = account.access_token;
          token._id = currentUser._id;
          token.user = currentUser;
        }
      } else {
        if (user) {
          token.accessToken = user.accessToken;
          token._id = user._id;
          token.user = user;
          const updatedUser = await User.findById(token._id);
          token.user = updatedUser;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.accessToken = token.accessToken;
        session.user.createdAt = token.user.createdAt;
        session.user.role = token.user.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/iniciar',
    error: '/error',
  },

  secret: process.env.NEXTAUTH_SECRET,
};
