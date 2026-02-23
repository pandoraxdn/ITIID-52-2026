import {useReducer} from "react";

export interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export interface FormData {
  email: string;
  password: string;
  dark: boolean;
  mounted: boolean;
}

interface UseLogin {
  handleInputChange: (fieldName: keyof FormData, value: string | boolean) => void;
  particles: Particle[];
  setMount: () => void;
  state: FormData;
}

export const useLogin = (PARTICLE_COUNT?: number = 80): UseLogin => {

  const generateParticles = (): Particle[] => {
    return Array.from({length: PARTICLE_COUNT}, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.6 + 0.2,
    }));
  }

  const particles: Particle[] = generateParticles();

  const initialForm: FormData = {
    email: '',
    password: '',
    dark: false,
    mounted: false
  }

  type Action = {type: "handleInputChange", payload: {fieldName: keyof FormData, value: string | boolean}};

  const formReducer = (state: FormData, action: Action) => {
    switch (action.type) {
      case "handleInputChange":
        return {
          ...state,
          [action.payload.fieldName]: action.payload.value
        }
    }
  }

  const [state, dispatch] = useReducer(formReducer, initialForm);

  const setMount = () => {
    dispatch({type: "handleInputChange", payload: {fieldName: 'mounted', value: true}});
  }

  const handleInputChange = (fieldName: keyof FormData, value: string | boolean) => {
    dispatch({type: "handleInputChange", payload: {fieldName, value}});
  }

  const handleSubmit = () => console.log(state);

  return {state, handleInputChange, particles, setMount};
}
