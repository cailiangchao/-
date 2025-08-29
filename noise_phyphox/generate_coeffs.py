
import numpy as np

def get_a_weighting_coeffs(nfft, samplerate):
    """
    Generate A-weighting coefficients for a given FFT size and sample rate.
    """
    freqs = np.fft.rfftfreq(nfft, 1.0/samplerate)
    f_sq = freqs**2
    
    f1 = 20.598997
    f2 = 107.65265
    f3 = 737.86223
    f4 = 12194.217
    
    f1_sq = f1**2
    f2_sq = f2**2
    f3_sq = f3**2
    f4_sq = f4**2
    
    # IEC 61672-1:2013 formula for the A-weighting filter response
    # The formula is for the amplitude response (linear scale)
    num = (f4**2) * (f_sq**2)
    den = (f_sq + f1_sq) * np.sqrt(f_sq + f2_sq) * np.sqrt(f_sq + f3_sq) * (f_sq + f4_sq)
    
    # Avoid division by zero at f=0
    weights = np.divide(num, den, out=np.zeros_like(num), where=den!=0)
    
    # The phyphox example seems to have the peak normalized to 1.
    weights_peak_normalized = weights / np.max(weights)

    return weights_peak_normalized

n_fft = 2048
sr = 22050
coeffs = get_a_weighting_coeffs(n_fft, sr)

# Format the output as a space-separated string with 6 decimal places
coeffs_str = " ".join([f"{c:.6f}" for c in coeffs])
print(coeffs_str)
