import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import odeint


h_list = []
h_new = []
import csv
with open("Zeszyt1.csv") as file:
  csvreader = csv.reader(file)
  print(csvreader)
  print("test@@@@@@@@@@@@@@@@@@@@@@@")
  for row in csvreader:
    #print(row[0])
    h_list.append(float(row[0]))

  #print (h_list)

# Wartosc temperatury w wybranym momencie czasu
TEMP_ZEW = h_list[150] # OD jakiego parametru ma zadzialac regulator
# Parametry symulacji
T_p = 0.1
# czas symulacji
Tsim = 360
# ilość probek
N = int(Tsim / T_p)

Ta = 28 + 273.15   # K TEMPERATURA ZADANA JAKA CHCEMY UZYSKAC

def heat(x,t,Q):


    #PARAMETRY TERARIUM
    U = 10.0           # W/m^2-K
    m = 4.0/1000.0     # kg
    Cp = 0.5 * 1000.0  # J/kg-K
    A = 12.0 / 100.0**2 # Area in m^2
    #STALA
    alpha = 0.01       # W / % heater
    eps = 0.9          # Emissivity
    sigma = 5.67e-8    # Stefan-Boltzman
    #print(x)

    # okreslanie temperatury do obliczenia
    T = x[0]+273
    #print(x[0])

    # Nonlinear Energy Balance
    dTdt = (1.0/(m*Cp))*(U*A*(Ta-T) \
            + eps * sigma * A * (Ta**4 - T**4) \
            + alpha*Q)
    return dTdt




Q = 40.0 # Percent Heater (0-100%)
n = 60*10+1  # Number of second time points (10min)
time = np.linspace(0,N-1,N) # wektor czasu
T = odeint(heat,TEMP_ZEW,time,args=(Q,)) # Integrate ODE
print(T)





plt.figure(1)
plt.plot(time,T-20,'b-')
plt.ylabel('Zajebista temperatura')
plt.xlabel('czas')
plt.legend(['Zajebisty wykres)'])
plt.show()

