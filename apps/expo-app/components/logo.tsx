import { View } from 'react-native';
import { Path, Svg } from 'react-native-svg';

export function LogoImage({
  width = 80,
  height = 30,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <View
      style={[
        { alignItems: 'center', justifyContent: 'center' },
      ]}
    >
      <Svg width={width} height={height} viewBox="0 0 733 140" fill="none">
        <Path
          d="M119.081 138V73.209C119.081 67.551 117.08 62.79 113.078 58.926C109.214 55.062 104.453 53.13 98.7951 53.13C93.2751 53.13 88.4451 55.062 84.3051 58.926C80.3031 62.652 78.3021 67.344 78.3021 73.002V138H59.4651V73.002C59.4651 67.206 57.5331 62.514 53.6691 58.926C49.5291 55.062 44.6301 53.13 38.9721 53.13C33.4521 53.13 28.7601 55.062 24.8961 58.926C20.7561 63.066 18.6861 67.965 18.6861 73.623V138H0.0560548V36.984H18.6861V44.643C21.0321 41.745 24.0681 39.33 27.7941 37.398C31.6581 35.466 35.3841 34.5 38.9721 34.5C45.0441 34.5 50.5641 35.742 55.5321 38.226C60.6381 40.572 65.0541 43.884 68.7801 48.162C72.5061 43.884 76.9221 40.572 82.0281 38.226C87.1341 35.742 92.7231 34.5 98.7951 34.5C104.177 34.5 109.214 35.466 113.906 37.398C118.598 39.33 122.738 42.09 126.326 45.678C129.914 49.266 132.674 53.475 134.606 58.305C136.676 62.997 137.711 67.965 137.711 73.209V138H119.081ZM242.173 138V122.268C237.757 127.374 232.651 131.445 226.855 134.481C221.059 137.517 214.918 139.035 208.432 139.035C201.256 139.035 194.494 137.724 188.146 135.102C181.936 132.48 176.416 128.754 171.586 123.924C166.756 119.232 162.961 113.712 160.201 107.364C157.579 100.878 156.268 94.116 156.268 87.078C156.268 80.04 157.579 73.347 160.201 66.999C162.961 60.513 166.756 54.855 171.586 50.025C176.416 45.195 181.936 41.469 188.146 38.847C194.494 36.225 201.256 34.914 208.432 34.914C215.056 34.914 221.266 36.294 227.062 39.054C232.996 41.814 238.033 45.678 242.173 50.646V36.984H260.803V138H242.173ZM208.432 53.337C203.878 53.337 199.462 54.234 195.184 56.028C191.044 57.684 187.456 60.03 184.42 63.066C181.384 66.102 178.969 69.759 177.175 74.037C175.519 78.177 174.691 82.524 174.691 87.078C174.691 91.632 175.519 95.979 177.175 100.119C178.969 104.259 181.384 107.847 184.42 110.883C187.456 113.919 191.044 116.334 195.184 118.128C199.462 119.784 203.878 120.612 208.432 120.612C212.986 120.612 217.333 119.784 221.473 118.128C225.613 116.334 229.201 113.919 232.237 110.883C235.273 107.847 237.619 104.259 239.275 100.119C241.069 95.979 241.966 91.632 241.966 87.078C241.966 82.524 241.069 78.177 239.275 74.037C237.619 69.759 235.273 66.102 232.237 63.066C229.201 60.03 225.613 57.684 221.473 56.028C217.333 54.234 212.986 53.337 208.432 53.337ZM331.127 138L299.663 99.705V138H281.447V0.344996H299.663V59.754L327.815 33.258H354.932L305.873 78.798L355.139 138H331.127ZM379.299 94.116C379.299 97.428 380.472 100.878 382.818 104.466C385.302 108.054 388.131 111.09 391.305 113.574C397.101 118.128 403.863 120.405 411.591 120.405C423.873 120.405 433.878 114.471 441.606 102.603L457.338 111.918C451.956 120.612 445.332 127.305 437.466 131.997C429.6 136.689 420.975 139.035 411.591 139.035C404.553 139.035 397.86 137.724 391.512 135.102C385.164 132.342 379.575 128.547 374.745 123.717C369.915 118.887 366.12 113.298 363.36 106.95C360.738 100.602 359.427 93.909 359.427 86.871C359.427 79.833 360.738 73.14 363.36 66.792C366.12 60.306 369.915 54.648 374.745 49.818C379.437 44.988 384.957 41.262 391.305 38.64C397.791 36.018 404.553 34.707 411.591 34.707C418.629 34.707 425.322 36.018 431.67 38.64C438.156 41.262 443.745 44.988 448.437 49.818C458.649 60.306 463.755 72.45 463.755 86.25C463.755 88.734 463.548 91.356 463.134 94.116H379.299ZM411.591 51.681C405.933 51.681 400.62 52.923 395.652 55.407C390.684 57.891 386.682 61.203 383.646 65.343C380.748 69.345 379.299 73.623 379.299 78.177H443.883C443.883 73.623 442.365 69.345 439.329 65.343C436.431 61.203 432.498 57.891 427.53 55.407C422.562 52.923 417.249 51.681 411.591 51.681ZM528.543 54.372C525.231 52.854 522.264 52.095 519.642 52.095C514.122 52.095 509.568 54.027 505.98 57.891C502.116 62.031 500.184 66.792 500.184 72.174V138H482.382V72.174C482.382 64.722 484.245 57.891 487.971 51.681C491.835 45.471 497.079 40.641 503.703 37.191C508.671 34.845 513.984 33.672 519.642 33.672C524.196 33.672 528.543 34.5 532.683 36.156C536.823 37.812 541.17 40.503 545.724 44.229L528.543 54.372ZM610.092 138L578.628 99.705V138H560.412V0.344996H578.628V59.754L606.78 33.258H633.897L584.838 78.798L634.104 138H610.092ZM656.049 19.596C653.427 19.596 651.15 18.699 649.218 16.905C647.424 14.973 646.527 12.696 646.527 10.074C646.527 7.45199 647.424 5.24399 649.218 3.44999C651.15 1.51799 653.427 0.551993 656.049 0.551993C658.671 0.551993 660.879 1.51799 662.673 3.44999C664.605 5.24399 665.571 7.45199 665.571 10.074C665.571 12.696 664.605 14.973 662.673 16.905C660.879 18.699 658.671 19.596 656.049 19.596ZM647.562 138V34.5H664.95V138H647.562ZM717.4 53.13V138H699.805V53.13H684.28V34.5H699.805V0.344996H717.4V34.5H732.925V53.13H717.4Z"
          fill="#000"
        />
      </Svg>
    </View>
  );
}
