import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import React from "react";
import { runMigrations } from "./migrations";

export default function DBProvider({  children }: {  children: React.ReactNode; }) {
  return (
    <SQLiteProvider databaseName="financeiro.db" onInit={runMigrations}>
      {children}
    </SQLiteProvider>
  );
}
