export enum NavigationScreenType {
  SIDESTACK = 'SideStack',
  SIDEBOTTOMSTACK = 'SideBottomStack',
  USERBOARD = 'UserBoard',
  OTHERBOARD = 'OtherBoard',
  FICTIONINDEX = 'FictionIndex',
  VIEWER = 'Viewer',
  GENRESELECT = 'GenreSelect',
  OTHERFICTIONLIST = 'OtherFictionList',
}

export type SideStackScreen =
  | 'GenreSelect'
  | 'FictionIndex'
  | 'Viewer'
  | 'UserBoard';

export type SideBottomStackScreen = 'OtherFictionList';

export type ArchiveTopTabScreen = 'Preferred' | 'Continue';
