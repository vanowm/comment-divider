import { BUILDERS_MAP, buildSolidLine } from './builders';
import { getConfig } from './config';
import { checkCommentChars, checkLongText } from './errors';
import { TRANSFORM_MAP } from './transforms';
import { IConfig, PresetId } from './types';

const extractIndent = (rawText: string): string => rawText.split(/\S+/)[0];

const renderHeader = (croppedText: string, config: IConfig, indent: string): string => {
  checkCommentChars(croppedText, config.limiters);
  // Skip long text validation if allowLongText is enabled, permitting longer text in headers.
  if (!config.allowLongText) checkLongText(croppedText, config.lineLen, config.limiters);

  const transformedWords = TRANSFORM_MAP[config.transform](croppedText);
  const buildFn = BUILDERS_MAP[config.height];
  return buildFn(config, transformedWords, indent, config.fillerSym);
};

const renderLine = (config: IConfig, indent: string): string => {
  if (!config.allowLongText) checkLongText('', config.lineLen, config.limiters);

  const buildFn = buildSolidLine;
  return buildFn(config, indent, config.fillerSym);
};

export const render = (type: PresetId, rawText: string, lang: string): string => {
  const config = getConfig(type, lang);
  const indent = extractIndent(rawText);

  if (config.includeIndent) {
    config.lineLen = config.lineLen - indent.length;
  }

  const croppedText = rawText.trim();

  switch (type) {
    case 'line':
      return renderLine(config, indent);
    case 'mainHeader':
    case 'subheader':
      return renderHeader(croppedText, config, indent);
  }
};
