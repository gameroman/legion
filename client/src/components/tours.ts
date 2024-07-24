import Shepherd from 'shepherd.js';

function getTour() {
    return new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          classes: 'tour-step',
          scrollTo: true
        }
      });
}
export function makeRankTour() {
    const tour = getTour();
    
}