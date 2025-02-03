import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <SignIn 
        redirectUrl="/home"
        appearance={{
          elements: {
            rootBox: "my-5",
            card: "shadow-lg"
          }
        }}
      />
    </div>
  );
}
