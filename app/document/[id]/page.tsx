"use client"

import DocumentEditor from "@/frontend/src/pages/DocumentEditor"
import Layout from "@/frontend/src/components/Layout"

export default function DocumentPage({ params }: { params: { id: string } }) {
  return (
    <Layout>
      <DocumentEditor />
    </Layout>
  )
} 