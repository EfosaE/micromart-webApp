// app/routes/simulate-error.tsx

export const loader = async () => {
  // Simulate a delay (e.g., 60 seconds)
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Throw a 504 error
  throw new Response(JSON.stringify({ message: 'Gateway Timeout' }), {
    status: 504,
    headers: { 'Content-Type': 'application/json' },
  });
};

export default function SimulateError() {
  return <div>This route is for simulating a timeout error.</div>;
}
