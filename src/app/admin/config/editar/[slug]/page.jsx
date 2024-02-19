import { getOnePost } from '@/app/_actions';
import BlogPublishedComponent from '@/components/blog/BlogPublishedComponent';

const PostDetailsPage = async ({ params }) => {
  const data = await getOnePost(params.slug);
  const post = JSON.parse(data.post);
  return <BlogPublishedComponent post={post} />;
};

export default PostDetailsPage;
