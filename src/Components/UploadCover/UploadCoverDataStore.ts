type DatasType = {
  feaktion_title: string
  feaktion_description: string
  feaktion_tag: Array<string>
  feaktion_genre: Array<string>
}

class UploadCoverData {
  // types
  feaktionTitle: string
  feaktionDescription: string
  feaktionTag: Array<string>
  feaktionGenre: Array<string>

  constructor(datas: DatasType) {
    // init
    this.feaktionTitle = datas.feaktion_title
    this.feaktionDescription = datas.feaktion_description
    this.feaktionTag = datas.feaktion_tag
    this.feaktionGenre = datas.feaktion_genre
  }

  init() {
    this.feaktionTitle = ''
    this.feaktionDescription = ''
    this.feaktionTag = []
    this.feaktionGenre = []
  }
}

export const UploadCoverDataStore = (
  datas?: DatasType
): UploadCoverData | null => {
  if (!datas) return null
  return new UploadCoverData(datas)
}
