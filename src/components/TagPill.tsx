import { tailwindColors } from '../constants';

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * tailwindColors.length);
  const color = tailwindColors[randomIndex];
  return {
    text: `text-${color}-900`,
    bg: `bg-${color}-100`
  };
}

const TagPill = ({ tag }: { tag: string }) => {
  const { text, bg } = getRandomColor();
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold mr-1 ${text} ${bg}`}>
      {tag}
    </span>
  );
}

export default TagPill