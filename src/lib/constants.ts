export const PROMPT =
  "Add Hatsune Miku's iconic twin-tails to this image. The twin-tails must be long turquoise teal (#39C5BB) hair flowing in two pigtails past the shoulders. Each tail tied at the base with a small cylindrical black band, followed by a short red ribbon. The strands should frame the face naturally. Keep the original face, body, pose, clothing, lighting, and background unchanged."

export const MAX_IMAGE_SIZE = 4 * 1024 * 1024

export const HISTORY_KEY = 'mikuficator-history'

export const GALLERY_ITEMS = [
  { id: 'cat', label: 'Chat', src: '/images/cat.jpg' },
  { id: 'person', label: 'Personne', src: '/images/person.jpg' },
  { id: 'object', label: 'Objet', src: '/images/object.jpg' },
] as const
