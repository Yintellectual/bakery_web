/* eslint-disable no-unused-vars */
export interface ImageProps {
  id: number;
  height: string;
  width: string;
  public_id: string;
  format: string;
  blurDataUrl?: string;
  tags?: Tag[];
}

export interface SharedModalProps {
  index: number;
  images?: ImageProps[];
  currentPhoto?: ImageProps;
  changePhotoId: (newVal: number) => void;
  closeModal: () => void;
  navigation: boolean;
  direction?: number;
  cakeSchema?: Schema;
  handleCakeUpdate: Function;
}

export interface Attribute {
  title: string;
  readOnly: boolean;
  type: string;
  items?: object;
}
export interface Schema {
  title: string;
  properties: object;
  definitions?: object;
  type: string;
  $schema?: string;
}
export interface Tag {
  id: string;
  text: string;
}

export interface Cake {
  photo: string;
  tags: string[];
}
