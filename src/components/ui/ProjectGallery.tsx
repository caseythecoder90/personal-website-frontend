import type { ProjectImageResponse } from '@/types';

interface ProjectGalleryProps {
  images: ProjectImageResponse[];
}

export function ProjectGallery({ images }: ProjectGalleryProps) {
  if (images.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-8 mt-32 space-y-12">
      <div className="flex items-end justify-between">
        <h2 className="text-4xl font-headline font-bold tracking-tight">
          System <span className="text-primary italic">Snapshots</span>
        </h2>
        <span className="text-on-surface-variant text-sm font-label tracking-widest">
          {images.length} {images.length === 1 ? 'IMAGE' : 'IMAGES'}
        </span>
      </div>

      {/* Adaptive grid based on image count */}
      <div className={`grid gap-4 ${
        images.length === 1
          ? 'grid-cols-1 h-[400px]'
          : images.length === 2
            ? 'grid-cols-1 md:grid-cols-2 h-[400px]'
            : 'grid-cols-1 md:grid-cols-12 h-[800px] md:h-[600px]'
      }`}>
        {images.length >= 3 ? (
          <>
            {/* Large featured image */}
            <div className="md:col-span-8 overflow-hidden rounded-xl border border-white/5 relative group">
              <img
                src={images[0].url}
                alt={images[0].altText ?? 'Project screenshot'}
                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              />
              {images[0].caption && (
                <div className="absolute bottom-6 left-6 bg-background/80 backdrop-blur-md px-4 py-2 rounded border border-white/10 text-xs tracking-widest font-bold uppercase">
                  {images[0].caption}
                </div>
              )}
            </div>
            {/* Stacked smaller images */}
            <div className="md:col-span-4 grid grid-rows-2 gap-4">
              {images.slice(1, 3).map((img: ProjectImageResponse) => (
                <GalleryImage key={img.id} image={img} />
              ))}
            </div>
          </>
        ) : (
          /* 1 or 2 images — simple equal grid */
          images.map((img: ProjectImageResponse) => (
            <GalleryImage key={img.id} image={img} />
          ))
        )}
      </div>

      {/* Overflow images beyond the first 3 */}
      {images.length > 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.slice(3).map((img: ProjectImageResponse) => (
            <div key={img.id} className="aspect-video overflow-hidden rounded-xl border border-white/5 group relative">
              <img
                src={img.url}
                alt={img.altText ?? 'Project screenshot'}
                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              />
              {img.caption && (
                <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 text-xs tracking-widest font-bold uppercase">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ============================================================================
// Internal sub-component for repeated image card pattern
// ============================================================================

function GalleryImage({ image }: { image: ProjectImageResponse }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/5 group relative">
      <img
        src={image.url}
        alt={image.altText ?? 'Project screenshot'}
        className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
      />
      {image.caption && (
        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 text-xs tracking-widest font-bold uppercase">
          {image.caption}
        </div>
      )}
    </div>
  );
}
