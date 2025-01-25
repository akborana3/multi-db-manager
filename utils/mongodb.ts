export async function connectToMongoDB(connectionKey: string): Promise<boolean> {
  try {
    const response = await fetch("/api/mongodb/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ connectionKey }),
    })
    const data = await response.json()
    return data.success
  } catch (error) {
    console.error("Connection error:", error)
    throw new Error("Failed to connect to MongoDB")
  }
}

export async function getDatabases(connectionKey: string): Promise<string[]> {
  const response = await fetch(`/api/mongodb?action=getDatabases&connectionKey=${connectionKey}`)
  return response.json()
}

export async function getCollections(connectionKey: string, database: string): Promise<string[]> {
  const response = await fetch(`/api/mongodb?action=getCollections&connectionKey=${connectionKey}&database=${database}`)
  return response.json()
}

export async function getDocuments(connectionKey: string, database: string, collectionName: string): Promise<any[]> {
  const response = await fetch(
    `/api/mongodb?action=getDocuments&connectionKey=${connectionKey}&database=${database}&collection=${collectionName}`,
  )
  return response.json()
}

export async function insertDocument(
  connectionKey: string,
  database: string,
  collectionName: string,
  document: any,
): Promise<any> {
  const response = await fetch("/api/mongodb", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "insertDocument",
      connectionKey,
      database,
      collection: collectionName,
      document,
    }),
  })
  return response.json()
}

export async function updateDocument(
  connectionKey: string,
  database: string,
  collectionName: string,
  id: string,
  update: any,
): Promise<any> {
  const response = await fetch("/api/mongodb", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "updateDocument",
      connectionKey,
      database,
      collection: collectionName,
      id,
      update,
    }),
  })
  return response.json()
}

export async function deleteDocument(
  connectionKey: string,
  database: string,
  collectionName: string,
  id: string,
): Promise<any> {
  const response = await fetch("/api/mongodb", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "deleteDocument",
      connectionKey,
      database,
      collection: collectionName,
      id,
    }),
  })
  return response.json()
}

