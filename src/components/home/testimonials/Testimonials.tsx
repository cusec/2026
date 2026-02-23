'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import useEmblaCarousel from 'embla-carousel-react'
import AutoHeight from 'embla-carousel-auto-height'
import type { EmblaPluginType } from 'embla-carousel'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from '../gallery/embla/EmblaCarouselArrowButtons'
import { useDotButton } from '../gallery/embla/EmblaCarouselDotButtons'
import { cn } from '@/lib/utils'
import testimonials from './testimonials.json'
import '../../../app/embla.css'

const CARD_BASE =
  'rounded-2xl border-4 border-white/10 backdrop-blur-xs px-8 py-8 md:px-12 md:py-10 flex flex-col gap-6 transition-all duration-300 cursor-default'
const CARD_ACTIVE =
  'bg-light-mode/10 hover:scale-[1.010] hover:shadow-[0_0_26px_rgba(245,240,233,0.1)]'
const CARD_INACTIVE = 'bg-light-mode/5 opacity-50'

const KOI_STYLE = {
  bottom: '-23vw',
  x: '-200%',
  rotate: 80,
  height: '35vw',
  minHeight: '140px',
  minWidth: '140px',
  width: '15vw',
  maxHeight: '520px',
  maxWidth: '520px'
}

const Testimonials: React.FC = () => {
  // autoheight for carousel only needed on mobile, since desktop cards are wide enough that heights are similar
  const [plugins, setPlugins] = useState<EmblaPluginType[]>([])
  useEffect(() => {
    if (window.matchMedia('(max-width: 767px)').matches)
      setPlugins([AutoHeight()])
  }, [])

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center' },
    plugins
  )
  const { selectedIndex } = useDotButton(emblaApi)
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <div className='relative mt-[25vh] md:mt-[35vh]'>
      <div
        id='Testimonials'
        className='max-w-[1800px] w-full flex flex-col items-center mx-auto'
      >
        <div className='w-full flex justify-center text-center mb-10'>
          <h2 className='text-3xl md:text-5xl xl:text-6xl font-bold pb-4 border-b-1 text-light-mode'>
            Why Join The Team
          </h2>
        </div>

        <div className='relative w-full md:max-w-[75vw]'>
          {/* edge fade overlays */}
          <div className='absolute inset-y-0 left-0 w-[18%] z-10 pointer-events-none bg-gradient-to-r from-sea to-transparent' />
          <div className='absolute inset-y-0 right-0 w-[18%] z-10 pointer-events-none bg-gradient-to-l from-sea to-transparent' />

          {/* nav buttons */}
          <div className='absolute left-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-sea/70 backdrop-blur-md'>
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
            />
          </div>
          <div className='absolute right-2 top-1/2 -translate-y-1/2 z-20 rounded-full bg-sea/70 backdrop-blur-md'>
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
            />
          </div>

          <div className='overflow-hidden py-5' ref={emblaRef}>
            <div className='flex items-center [touch-action:pan-y_pinch-zoom] -ml-6'>
              {testimonials.map((item, idx) => (
                <div
                  key={idx}
                  className='flex-[0_0_85%] md:flex-[0_0_70%] min-w-0 pl-6'
                >
                  <div
                    className={cn(
                      CARD_BASE,
                      idx === selectedIndex ? CARD_ACTIVE : CARD_INACTIVE
                    )}
                  >
                    <p className='text-sm md:text-base leading-[1.6] text-light-mode'>
                      {item.quote}
                    </p>
                    <div className='flex flex-col gap-1'>
                      <span className='text-sm font-medium text-light-mode/60'>
                        {item.name}
                      </span>
                      {item.title && (
                        <span className='text-xs text-light-mode/40 whitespace-pre-line'>
                          {item.title}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* decorative koi — desktop only, bobs on a 3s loop */}
      <motion.div
        className='hidden md:block absolute left-1/2 z-10'
        style={KOI_STYLE}
        animate={{ y: ['0vw', '-0.8vw', '0vw'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className='relative w-full h-full'>
          <Image
            src='/images/koi2.svg'
            alt='Koi'
            fill
            className='object-contain opacity-80'
          />
        </div>
      </motion.div>
    </div>
  )
}

export default Testimonials
