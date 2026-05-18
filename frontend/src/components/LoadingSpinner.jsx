export default function LoadingSpinner({ size = 'md' }) {
  const sizes = { sm: 'text-2xl', md: 'text-4xl', lg: 'text-6xl' };
  return (
    <section className="flex justify-center items-center py-12">
      <span className={`animate-pulse ${sizes[size]}`} role="status" aria-label="Loading">⏳</span>
    </section>
  );
}
