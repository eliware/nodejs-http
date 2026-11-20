import imageDistributionApi from "../distributions.mjs";
const { distroFromRepository } = imageDistributionApi();
import imageDistributionLabelsApi from "../distribution-labels.mjs";
const { distroLabel, distroRelease } = imageDistributionLabelsApi();

function mapImageDistribution(repository) {
  const distro = distroFromRepository(repository);
  return {
    distro,
    distroLabel: distroLabel(distro),
    release: distroRelease(distro),
  };
}

export default function __moduleApi0() {
  return { mapImageDistribution };
}
