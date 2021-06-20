import React from 'react'
import Layout from '@theme/Layout'
import FileBrowser from 'react-keyed-file-browser'

import 'react-keyed-file-browser/dist/react-keyed-file-browser.css'

export default function Home() {
  return (
    <Layout description="Folder based file browser given a flat keyed list of objects, powered by React.">
      <main>
        <div>
          <FileBrowser
            files={[
              {
                key: 'cat.png',
                size: 1.5 * 1024 * 1024,
              },
              {
                key: 'kitten.png',
                size: 545 * 1024,
              },
              {
                key: 'elephant.png',
                size: 52 * 1024,
              },
            ]}
          />
        </div>
      </main>
    </Layout>
  )
}
