export const successResponse = (data: any, status = 200) => {
  return Response.json(data, { status })
}

export const errorResponse = (message: string, status = 400) => {
  return Response.json({ error: message }, { status })
}
