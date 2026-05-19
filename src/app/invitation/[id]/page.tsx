import InvitationIdClientPage from './client-page';

// Required for static export with dynamic routes
export function generateStaticParams() {
  return [];
}

export default function Page() {
  return <InvitationIdClientPage />;
}