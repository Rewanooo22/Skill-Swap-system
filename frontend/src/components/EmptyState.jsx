export default function EmptyState({ icon = '📭', title, message, action }) {
  return (
    <section className="text-center py-16">
      <span className="text-5xl mb-4 block">{icon}</span>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {message && <p className="text-gray-500 mb-6 max-w-sm mx-auto">{message}</p>}
      {action}
    </section>
  );
}
