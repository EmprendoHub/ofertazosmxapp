"use client";

import { useEffect, useState } from "react";
import { createHash } from "crypto";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { hasCookie, setCookie, getCookie } from "cookies-next";

const MercadoAuthPage = ({ searchParams }: { searchParams: any }) => {
  const [error, setError] = useState("");
  const [code, setCode] = useState(searchParams?.code);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");

  const generateCodeVerifier = () => {
    // Generate a random code verifier
    const codeVerifier =
      process.env.NEXT_PUBLIC_MERCADO_LIBRE_CHALLENGE!.toString();
    return codeVerifier;
  };

  const generateCodeChallenge = async (codeVerifier: string) => {
    // Generate a code challenge from the code verifier
    const hash = createHash("sha256").update(codeVerifier).digest();

    return hash
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  };

  const handleAuthentication = async () => {
    try {
      const appId = process.env.NEXT_PUBLIC_MERCADO_LIBRE_APP_ID;
      const redirectUri = process.env.NEXT_PUBLIC_MERCADO_LIBRE_REDIRECT_URL;
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // Store codeVerifier in localStorage to use it later
      localStorage.setItem("codeVerifier", codeVerifier);

      const authUrl = `https://auth.mercadolibre.com.mx/authorization?response_type=code&client_id=${appId}&redirect_uri=${redirectUri}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
      window.location.href = authUrl;
    } catch (err) {
      console.log(err);
      setError("Error occurred during authentication");
    }
  };

  useEffect(() => {
    // If we have a code in the URL, exchange it for a token immediately
    const accessToken = getCookie("mercadotoken");
    if (code) {
      if (!accessToken) {
        handleCreateToken(code);
      } else {
        setToken(accessToken);
      }
    }
  }, [code]);

  const handleCreateToken: any = async (authCode: string) => {
    try {
      const codeVerifier = localStorage.getItem("codeVerifier");
      if (!codeVerifier) {
        throw new Error("No code verifier found");
      }

      const response = await fetch("/api/mercatoken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codeVerifier: codeVerifier,
          code: authCode,
        }),
      });
      const tokenResponse = await response.json();
      if (tokenResponse.error) {
        setError(tokenResponse.error);
        return;
      }
      setToken(tokenResponse.access_token);
      setCookie("mercadotoken", tokenResponse.access_token);
      localStorage.removeItem("codeVerifier"); // Clean up
    } catch (err: any) {
      setError("Error al crear token: " + err.message);
    }
  };

  const handleCreateUser = async () => {
    try {
      const accessToken = getCookie("mercadotoken");
      const response = await fetch(
        "https://api.mercadolibre.com/users/test_user",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ site_id: "MLM" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const testUser = await response.json();
      console.log(testUser);
      setUser(testUser);
    } catch (err) {
      setError("Error al crear usuario");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Image
        src={"/icons/mercadolibre-svgrepo-com.svg"}
        alt="MercadoLibre"
        width={200}
        height={200}
        className="w-[80px] h-[80px}"
      />
      {!code && (
        <div className="flex flex-col items-center justify-center">
          <h1>Authenticate with MercadoLibre</h1>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button onClick={handleAuthentication} size={"sm"}>
            Authenticate
          </Button>
        </div>
      )}
      {!hasCookie("mercadotoken") ? (
        <div>
          {code && (
            <div className="flex flex-col items-center justify-center">
              <h1>Create Token for MercadoLibre</h1>
              <p className="text-xs mb-3">Code: {code}</p>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <Button onClick={handleCreateToken} size={"sm"}>
                Create Token
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div>
          {token && (
            <div className="flex flex-col items-center justify-center">
              <h1>Create Test User for MercadoLibre</h1>
              <p className="text-xs mb-3">Token: {token}</p>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <Button onClick={handleCreateUser} size={"sm"}>
                Create Test User
              </Button>
            </div>
          )}
          <div className="flex flex-col items-center justify-center mt-5">
            {user && <p>User: {JSON.stringify(user)}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MercadoAuthPage;
