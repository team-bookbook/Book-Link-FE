import { cn } from '@libs/cn';

import intro1 from '@images/intro-1.png';
import intro2 from '@images/intro-2.png';
import intro3 from '@images/intro-3.png';
import intro4 from '@images/intro-4.png';

type IntroduceVariant = 'peach' | 'pink' | 'purple' | 'sky';

type Props = {
  id: string;
  title: string;
  stepText: string;
  variant: IntroduceVariant;
  imageAlt?: string;
  className?: string;
};

function variantBg(v: IntroduceVariant): string {
  if (v === 'peach') return 'bg-linear-peach';
  if (v === 'pink') return 'bg-linear-pink';
  if (v === 'purple') return 'bg-linear-purple';
  return 'bg-linear-sky';
}

const VARIANT_IMAGE: Record<IntroduceVariant, string> = {
  peach: intro1 as string,
  pink: intro2 as string,
  purple: intro3 as string,
  sky: intro4 as string,
};

export default function IntroduceBanner({ id, title, stepText, variant, imageAlt, className = '' }: Props) {
  const imgSrc = VARIANT_IMAGE[variant];
  const alt = imageAlt ?? title;

  return (
    <article
      id={id}
      data-introduce-banner
      className={cn(
        'w-full',
        variantBg(variant),
        'rounded-[12px]',
        'px-[1.8rem] py-[3rem]',
        'flex items-center justify-between',
        'bg-cover bg-no-repeat',
        className
      )}
    >
      <div className='mr-[1.2rem] flex min-w-0 flex-col gap-[0.4rem]'>
        <h3 className='title6 whitespace-pre-line text-gray-900'>{title}</h3>
        <p className='caption5 text-gray-900'>{stepText}</p>
      </div>

      <img src={imgSrc} alt={alt} className='h-[6.6rem] w-[6.6rem] shrink-0' loading='lazy' />
    </article>
  );
}
