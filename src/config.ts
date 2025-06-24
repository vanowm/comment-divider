import { workspace } from 'vscode';

import { EXT_ID } from './constants';
import { getLanguageLimiters } from './limiters';
import {
  IPreset,
  ILimiters,
  IConfig,
  PresetId,
  Height,
  Align,
  Transform,
  ILanguagesMapConfig
} from './types';

const getPreset = (type: PresetId): IPreset => {
  const section = workspace.getConfiguration(EXT_ID);

  const lineLen = section.get<number>('length');
  const allowLongText = section.get<boolean>('allowLongText');
  const fillerSym = section.get<string>(`${type}Filler`);
  const topSym = section.get<string>(`${type}FillerTop`);
  const bottomSym = section.get<string>(`${type}FillerBottom`);
  const height = section.get<Height>(`${type}Height`);
  const align = section.get<Align>(`${type}Align`);
  const transform = section.get<Transform>(`${type}Transform`);
  const includeIndent = section.get<boolean>(`shouldLengthIncludeIndent`);

  return {
    lineLen,
    fillerSym,
    topSym,
    bottomSym,
    height,
    align,
    transform,
    includeIndent,
    allowLongText
  };
};

const getLanguagesMapConfig = () =>
  workspace.getConfiguration(EXT_ID).inspect('languagesMap')
    .globalValue as ILanguagesMapConfig;

const mergePresetWithLimiters = (preset: IPreset, limiters: ILimiters): IConfig => ({
  ...preset,
  limiters
});

export const getConfig = (presetId: PresetId, lang: string): IConfig =>
  mergePresetWithLimiters(
    getPreset(presetId),
    getLanguageLimiters(lang, getLanguagesMapConfig)
  );
