import type { OnboardingSlide } from "../domain/types/onboarding-slide";

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: "welcome",
    title: "Welcome to Chatterbrain!",
    description:
      "Let's set up your experience so conversations feel more like you.",
    skippable: false,
    chitterSays:
      "Hey there! I'm Chitter. Before we jump in, I'd love to learn a little about you so I can help you practice in ways that actually matter.",
    fields: [],
  },
  {
    id: "birthday",
    title: "When's your birthday?",
    description: "We use this to tailor scenarios to your age group.",
    skippable: false,
    chitterSays:
      "No pressure — but knowing your birthday helps me suggest situations that feel right for your stage of life.",
    fields: [
      {
        type: "text",
        fieldKey: "birthday",
        label: "Birthday",
        placeholder: "e.g. March 15, 2005",
        required: false,
      },
    ],
  },
  {
    id: "identity",
    title: "Tell us about yourself",
    description: "This helps us personalize how Chitter addresses you.",
    skippable: true,
    chitterSays:
      "Everyone's different, and that's great. Share what you're comfortable with — you can always skip this and add it later.",
    fields: [
      {
        type: "single-choice",
        fieldKey: "gender",
        label: "Gender",
        required: false,
        options: [
          { id: "male", label: "Male" },
          { id: "female", label: "Female" },
          { id: "non-binary", label: "Non-binary" },
          { id: "prefer-not-to-say", label: "Prefer not to say" },
        ],
      },
    ],
  },
  {
    id: "goals",
    title: "What are your goals?",
    description: "Pick what you'd like to get out of Chatterbrain.",
    skippable: true,
    chitterSays:
      "Knowing your goals helps me point you toward the right practice scenarios. What are you hoping to work on?",
    fields: [
      {
        type: "multi-choice",
        fieldKey: "goals",
        label: "Goals",
        required: false,
        min: 0,
        options: [
          {
            id: "build-confidence",
            label: "Build confidence",
            description:
              "Feel more at ease in new or intimidating social situations",
          },
          {
            id: "improve-conversation",
            label: "Improve conversation skills",
            description:
              "Learn to read social cues and keep conversations flowing naturally",
          },
          {
            id: "handle-conflict",
            label: "Handle conflict better",
            description: "Navigate disagreements with care",
          },
          {
            id: "make-friends",
            label: "Build strong relationships",
            description:
              "Feel comfortable with new people, make friends and build stronger connections",
          },
        ],
      },
    ],
  },
  {
    id: "interests",
    title: "What are you into?",
    description:
      "Your interests help us personalize conversation topics and scenarios.",
    skippable: true,
    chitterSays:
      "What do you love talking about? The more I know, the more natural our practice conversations can feel.",
    fields: [
      {
        type: "multi-choice",
        fieldKey: "interests",
        label: "Interests",
        required: false,
        min: 0,
        options: [
          { id: "music", label: "Music" },
          { id: "cooking", label: "Cooking" },
          { id: "art", label: "Art" },
          { id: "sports", label: "Sports" },
          { id: "gaming", label: "Gaming" },
          { id: "reading", label: "Reading" },
          { id: "writing", label: "Writing" },
          { id: "movies-tv", label: "Movies & TV" },
          { id: "technology", label: "Technology" },
          { id: "nature", label: "Nature & outdoors" },
          { id: "fitness", label: "Fitness" },
          { id: "travel", label: "Travel & culture" },
          { id: "science", label: "Science" },
          { id: "fashion", label: "Fashion & style" },
          { id: "animals", label: "Animals & pets" },
          { id: "volunteering", label: "Volunteering" },
          { id: "food", label: "Food & dining" },
          { id: "history", label: "History" },
          { id: "religion", label: "Religion & spirituality" },
          { id: "politics", label: "Politics & current events" },
        ],
      },
    ],
  },
  {
    id: "data-consent",
    title: "One last thing",
    description:
      "Before you start chattering, help us improve your experience by allowing Chatterbrain to use your information.",
    skippable: false,
    chitterSays:
      "To give you the best experience, Chatterbrain uses what you've shared to personalize practice. Your data stays safe with us.",
    fields: [
      {
        type: "consent",
        fieldKey: "dataConsentAccepted",
        label:
          "I allow Chatterbrain to use my information to improve my user experience.",
        required: true,
      },
    ],
  },
];
