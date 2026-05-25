import { useRevenueCatContext } from "@/context/RevenueCatContext";

export function useSubscription() {
  return useRevenueCatContext();
}
