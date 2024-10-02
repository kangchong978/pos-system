'use client';
import LoadingScreen from "@/components/LoadingScreen";
import { initializeApp, setLoading } from "@/redux_slices/appSlice";
import { RootState } from "@/store";
import { useCoreClient } from "@/utils/useClient";
import { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const { isInitialized, isLoading, coreClient, error, setAppLoading } = useCoreClient();

  if (!isInitialized || isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      return <LoadingScreen />;
    </>
  );
}