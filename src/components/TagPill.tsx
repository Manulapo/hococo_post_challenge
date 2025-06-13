import { tagPillsColorScheme } from '../constants';

const TagPill = ({ tag }: { tag: string }) => {
  const { text, bg } = tagPillsColorScheme[tag] || { text: 'text-gray-800', bg: 'bg-gray-100' };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold mr-1 ${text} ${bg}`}>
      {tag}
    </span>
  );
}

export default TagPill