const FILETYPE_EXTENSIONS = {
  Archive: [
    'zip',
    'rar',
    '7z',
  ],
  Audio: [
    'mp3',
    'ogg',
    'wav',
    'aac',
  ],
  Excel: [
    'xls',
    'xlsx',
  ],
  Image: [
    'jpg',
    'jpeg',
    'png',
    'bmp',
  ],
  PDF: [
    'pdf',
  ],
  PowerPoint: [
    'ppt',
    'pptx',
  ],
  Text: [
    'txt',
  ],
  Video: [
    'mp4',
    'flv',
    'avi',
    'wmv',
    'mov',
  ],
  Word: [
    'doc',
    'docx',
  ],
  Code: [
    'js',
  ],
}

const extensionMapping = {}

for (const [type, extensions] of Object.entries(FILETYPE_EXTENSIONS)) {
  for (const extension of extensions) {
    extensionMapping[extension] = type
  }
}

export { extensionMapping }
