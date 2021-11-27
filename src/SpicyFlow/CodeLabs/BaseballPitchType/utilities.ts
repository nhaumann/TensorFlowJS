export function PitchFromClassNum(classNum: number) {
    switch (classNum) {
      case 0:
        return 'Fastball (2-seam)';
      case 1:
        return 'Fastball (4-seam)';
      case 2:
        return 'Fastball (sinker)';
      case 3:
        return 'Fastball (cutter)';
      case 4:
        return 'Slider';
      case 5:
        return 'Changeup';
      case 6:
        return 'Curveball';
      default:
        return 'Unknown';
    }
  }