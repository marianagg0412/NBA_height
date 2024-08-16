import { useEffect, useState } from 'react';
import { playerNBA } from '../models/player'
import { Pair } from '../models/pair';

const Players = () => {
  const [players, setPlayers] = useState<playerNBA[]>([]);
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [height, setHeight] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const getPlayers = async () => {
    try{
    const response = await fetch("https://mach-eight.uc.r.appspot.com/");
    const data = await response.json();
    setPlayers(data.values.map((player: playerNBA) => ({
      first_name: player.first_name,
      last_name: player.last_name,
      h_in: parseInt(String(player.h_in), 10)
    })));
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const handlePageChange = (direction: number) => {
    setCurrentPage(prevPage => prevPage + direction);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, pairs.length);

  useEffect(() => {
    getPlayers();
  }, []);

  useEffect(() => {
    if (height > 0) {
      getPairs(height);
    }
  }, [height]);

  const getPairs = (height: number) => {
    let foundPairs: Pair[] = [];
    let clonePlayers = [...players];
    for (let i = 0; i < clonePlayers.length; i++) {
      for (let j = i + 1; j < clonePlayers.length; j++) {
        if (clonePlayers[i].h_in + clonePlayers[j].h_in === height) {
          foundPairs.push({ player1: clonePlayers[i], player2: clonePlayers[j] });
        }
      }
    }
    setPairs(foundPairs);
    console.log(foundPairs);
  };
  
  const pairsToDisplay = pairs.slice(startIndex, endIndex);

  return (
    <>
      <input
        type="number"
        placeholder="Enter height"
        onChange={(e) => setHeight(parseInt(e.target.value))}
      />
      {pairs.length > 0 ? (
        <>
          <h1>Found {pairs.length} matches</h1>
          <div>
            {pairsToDisplay.map((pair, index) => (
              <div key={index}>
                <p> {pair.player1.first_name} {pair.player1.last_name} {pair.player1.h_in} & {pair.player2.first_name} {pair.player2.last_name} {pair.player2.h_in}</p>
              </div>
            ))}
          </div>
          <div>
            <button
              onClick={() => handlePageChange(-1)}
              disabled={currentPage === 1}
            >
              &lt; Previous
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={() => handlePageChange(1)}
              disabled={endIndex >= pairs.length}
            >
              Next &gt;
            </button>
          </div>
        </>
      ) : (
        <h1>No matches found</h1>
      )}
    </>
  );
}

export default Players;
