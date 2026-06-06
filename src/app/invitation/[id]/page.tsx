import Invitation from '../../../components/Invitation';

// Required for static export with dynamic routes
// Returning a dummy param to satisfy the build requirement
export async function generateStaticParams() {
  return [{ id: '1' }];
}

export default function Page() {
  return <Invitation />;
}