import React, { useState, useEffect } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/prosecompellingcontent/Averra/main/public';

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(() => {
    // In Figma Make environment, use GitHub directly for local paths
    if (props.src?.startsWith('/')) {
      const githubUrl = `${GITHUB_RAW_BASE}${props.src}`;
      console.log(`ImageWithFallback: Loading ${props.src} from ${githubUrl}`);
      return githubUrl;
    }
    return props.src
  })

  // Update currentSrc when props.src changes
  useEffect(() => {
    if (props.src?.startsWith('/')) {
      setCurrentSrc(`${GITHUB_RAW_BASE}${props.src}`)
    } else {
      setCurrentSrc(props.src)
    }
    setDidError(false)
  }, [props.src])

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`❌ Image failed to load: ${props.src}`)
    console.error(`❌ Attempted URL: ${currentSrc}`)
    setDidError(true)
    // Call the user's onError if provided
    if (props.onError) {
      props.onError(e)
    }
  }

  const { src, alt, style, className, onError, onLoad, ...rest } = props

  if (didError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
        </div>
      </div>
    )
  }

  return (
    <img 
      src={currentSrc} 
      alt={alt} 
      className={className} 
      style={style} 
      onError={handleError}
      onLoad={onLoad}
      {...rest} 
    />
  )
}
