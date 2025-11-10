export async function fetchLaunches() {
  try {
    const response = await fetch('https://api.spacexdata.com/v5/launches');
    if (!response.ok) {
      throw new Error('Error al obtener los datos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching launches:', error);
    throw error;
  }
}