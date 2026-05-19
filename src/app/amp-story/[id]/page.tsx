import AmpStoryPage from './client-page';

// Required for static export with dynamic routes
export function generateStaticParams() {
  // Return an empty array - pages that aren't pre-rendered will 
  // be handled client-side via Firebase fetch
  return [];
}

export default function Page() {
  return <AmpStoryPage />;
}