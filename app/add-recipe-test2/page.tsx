import { Suspense } from "react";
import AddRecipeTest2Client from "./AddRecipeTest2Client";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddRecipeTest2Client />
    </Suspense>
  );
} 