import { NextApiRequest, NextApiResponse } from 'next'
import { getScreenshot } from './_lib/chromium'
import getThumbnailTemplate from './_lib/thumbTemplate'

const isDev = !process.env.AWS_REGION

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const title = String(req.query.title)

    if (!title) {
      throw new Error('Title is required')
    }

    const html = getThumbnailTemplate(title)

    const file = await getScreenshot(html, isDev)

    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 'public, immutable, no-transform, s-maxage=3153600, maxage=3153600')

    return res.end(file)
  } catch (error) {
    console.log(error)

    res.status(500).send('Internal server error')
  }
}
