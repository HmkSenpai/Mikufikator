export const PROMPT =
  "Do not modify the face, body, pose, clothing, lighting, or background of the original image. Only add Hatsune Miku's iconic twin-tails on top of the subject's head. The twin-tails must be exactly as Miku's: long turquoise/teal (#39C5BB) hair, flowing down past the shoulders. Each tail tied at the base with a small cylindrical black band, followed by a short red/pink ribbon. The strands should frame both sides of the face naturally and rest on top of the head respecting the original head shape and angle. Do not alter anything else."

export const API_MODEL = 'gemini-2.5-flash-image-preview'

export const MAX_IMAGE_SIZE = 4 * 1024 * 1024

export const HISTORY_KEY = 'mikuficator-history'

export const GALLERY_ITEMS = [
  {
    id: 'cat',
    label: 'Chat',
    src: 'https://placecats.com/300/300?random=1',
  },
  {
    id: 'person',
    label: 'Personne',
    src: 'https://i.pravatar.cc/300?u=1',
  },
  {
    id: 'object',
    label: 'Objet',
    src: 'https://picsum.photos/seed/object/300/300',
  },
] as const
