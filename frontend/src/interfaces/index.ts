export interface CreateFont {
  name: string;
  filename: string;
  path: string;
}

export interface UpdateFont {
  _id: string;
  name?: string;
  filename?: string;
  path?: string;
}

export interface CreateFontGroup {
  name: string;
  fonts: string[];  
}

export interface UpdateFontGroup {
  _id: string;
  name: string;
  fonts: string[];
}

export interface FontGroup {
  _id: string;
  name: string;
  fonts: UpdateFont[];
}