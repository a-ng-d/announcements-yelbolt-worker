import { Client, APIErrorCode, isFullDatabase } from '@notionhq/client'

interface Env {
  NOTION_API_KEY: string
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    const headers = request.headers
    const origin = headers.get('Origin') ?? '*'

    const corsHeaders: Record<string, string> = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Expose-Headers': '*',
      Vary: 'Origin',
    }

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      })
    }

    if (url.pathname === '/favicon.ico') {
      return new Response(null, {
        status: 204, // No Content
      })
    }

    if (url.searchParams.get('action') === 'get_version') {
      try {
        const notion = new Client({
          auth: headers.get('Authorization') ?? env.NOTION_API_KEY,
        })

        const announcementsInfo = await notion.databases.retrieve({
          database_id: url.searchParams.get('database_id') ?? 'e078993c1ac74bdb8d2806174927ddcb',
        })

        if (!isFullDatabase(announcementsInfo)) {
          return new Response(
            JSON.stringify({
              message: 'The database could not be queried',
            }) as BodyInit,
            {
              status: 400,
              headers: corsHeaders,
            },
          )
        }

        return new Response(
          JSON.stringify({
            version: announcementsInfo.description[0].plain_text as string,
          }) as BodyInit,
          {
            status: 200,
            headers: corsHeaders,
          },
        )
      } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === APIErrorCode.ObjectNotFound) {
          return new Response(
            JSON.stringify({
              message: 'The database is not found',
            }) as BodyInit,
            {
              status: 404,
              headers: corsHeaders,
            },
          )
        } else if (error instanceof Error && 'code' in error && error.code === APIErrorCode.Unauthorized) {
          return new Response(
            JSON.stringify({
              message: 'Unauthorized access to the database',
            }) as BodyInit,
            {
              status: 401,
              headers: corsHeaders,
            },
          )
        } else {
          console.error(error)
          return new Response(
            JSON.stringify({
              message: 'The database could not be queried',
            }) as BodyInit,
            {
              status: 400,
              headers: corsHeaders,
            },
          )
        }
      }
    }

    if (url.searchParams.get('action') === 'get_announcements') {
      try {
        const notion = new Client({
          auth: headers.get('Authorization') ?? env.NOTION_API_KEY,
        })

        const announcementsList = await notion.databases.query({
          database_id: url.searchParams.get('database_id') ?? 'e078993c1ac74bdb8d2806174927ddcb',
          filter: {
            property: 'Published',
            checkbox: {
              equals: true,
            },
          },
          sorts: [
            {
              property: 'Publication Date',
              direction: 'descending',
            },
          ],
        })

        return new Response(
          JSON.stringify({
            announcements: announcementsList.results,
          }) as BodyInit,
          {
            status: 200,
            headers: corsHeaders,
          },
        )
      } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === APIErrorCode.ObjectNotFound) {
          return new Response(
            JSON.stringify({
              message: 'The database is not found',
            }) as BodyInit,
            {
              status: 404,
              headers: corsHeaders,
            },
          )
        } else if (error instanceof Error && 'code' in error && error.code === APIErrorCode.Unauthorized) {
          return new Response(
            JSON.stringify({
              message: 'Unauthorized access to the database',
            }) as BodyInit,
            {
              status: 401,
              headers: corsHeaders,
            },
          )
        } else {
          console.error(error)
          return new Response(
            JSON.stringify({
              message: 'The database could not be queried',
            }) as BodyInit,
            {
              status: 400,
              headers: corsHeaders,
            },
          )
        }
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Invalid action',
      }) as BodyInit,
      {
        status: 400,
        headers: corsHeaders,
      },
    )
  },
}
