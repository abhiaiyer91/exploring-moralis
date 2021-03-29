pragma solidity ^0.8.0;

contract GameType {
    struct Game {
        uint256 balance;
        uint256 turn;
        uint256 time_limit;
        address payable owner;
        address payable opposition;
        bool isSet;
    }

    mapping(string => Game) games;

    // Check wheter a message has value or not
    modifier has_value {
        if (msg.value > 0) _;
    }

    string[] gameIds;

    // Function called by the client that want host the game to start it
    function start(string calldata _id) public payable has_value {
        // Assign a struct to the host
        Game storage g = games[_id];
        gameIds.push(_id);
        // Check if another game has already started at the same address
        if (g.balance == 0) {
            g.isSet = true;
            g.balance += msg.value;
        }
    }

    //Function called by the opponent to join an hosted game,
    //passing the host wallet addres as parameter
    function join(string calldata _id) public payable has_value {
        Game storage g = games[_id];
        // If the match does not exist or the opposition has already joined, exit.
        //if(!g.isSet || g.opposition > 0 || msg.value != g.balance) throw;
        require(
            g.isSet && g.opposition == address(0) && msg.value == g.balance
        );
        // Check if the host is not challenging himself
        if (g.opposition == address(0) && msg.sender != g.owner) {
            g.balance += msg.value;
            g.opposition = payable(msg.sender);
        }
    }

    // Debug function to print some attributes of the game
    function get_game_status(string calldata _id)
        public
        view
        returns (
            uint256,
            uint256,
            address,
            address
        )
    {
        Game storage g = games[_id];

        return (g.balance, g.turn, g.opposition, g.owner);
    }

    function get_games() public view returns (Game[] memory) {
        Game[] memory id = new Game[](gameIds.length);
        for (uint256 i = 0; i < gameIds.length; i++) {
            Game storage game = games[gameIds[i]];
            id[i] = game;
        }
        return id;
    }

    // Function used to restart the game, it's possible only if there's not
    // appended balance.
    function restart(string calldata _id) private {
        Game storage g = games[_id];
        if (g.balance == 0) {
            g.turn = 1;
            g.opposition = payable(address(0));
            g.time_limit = 0;
        }
    }

    // This function is called in order to claim the reward in case the opponent
    // exceed the time limit.
    function claim_reward(string calldata _id) public {
        Game storage g = games[_id];

        if (
            g.opposition != address(0) &&
            g.balance > 0 &&
            block.timestamp > g.time_limit
        ) {
            if (g.turn == 2) g.owner.transfer(g.balance);
            else g.opposition.transfer(g.balance);
            g.balance = 0;
            restart(_id);
        }
    }

    // Debug function to print out the current block timestamp
    function get_blocktimestamp() public view returns (uint256) {
        return (block.timestamp);
    }
}

// contract TicTacToe {
//     // Main struct that contains all game's info
//     struct Game {
//         uint256 balance;
//         uint256 turn;
//         address payable opposition;
//         uint256 time_limit;
//         mapping(uint256 => mapping(uint256 => uint256)) board;
//         bool isSet;
//     }

//     // keep track of all the current hosted games
//     mapping(address => Game) games;

//     //This function is needed to play a move on the board,
//     //take as arguments the wallet address of the host, row and columns where to put the sign
//     //Positions schema:
//     //[(0,0),(0,1),(0,2)]
//     //[(1,0),(1,1),(1,2)]
//     //[(2,0),(2,1),(2,2)]
//     function play(
//         address payable host,
//         uint256 row,
//         uint256 column
//     ) public {
//         Game storage g = games[host];

//         //Assign an int to identify players, host -> 1, opposition -> 2
//         uint8 player = 2;
//         if (msg.sender == host) player = 1;

//         // Performs some checks to verify the correctness of the move:
//         // 1 - There must be a bet value stored by the contract (balance)
//         // 2 - There must be an opponent to play
//         // 3 - You must play a move inside the board  0>=row>=2 and 0>=column>=2
//         // 4 - There should be no other moves played on the same place
//         // 5 - You must play in time w.r.t. TimeLimit
//         // 6 - There must be your turn
//         if (
//             g.balance > 0 &&
//             g.opposition != address(0) &&
//             row >= 0 &&
//             row < 3 &&
//             column >= 0 &&
//             column < 3 &&
//             g.board[row][column] == 0 &&
//             (g.time_limit == 0 || block.timestamp <= g.time_limit) &&
//             g.turn != player
//         ) {
//             // Put the move in the board
//             g.board[row][column] = player;

//             // If the board is full resend halved balance to each player
//             if (is_board_full(host)) {
//                 host.transfer(g.balance / 2);
//                 g.opposition.transfer(g.balance / 2);
//                 g.balance = 0;
//                 restart(host);
//                 return;
//             }

//             // If the last move decreed a winner send thw whole balance to him
//             // and restart the game
//             if (is_winner(host, player)) {
//                 if (player == 1) host.transfer(g.balance);
//                 else g.opposition.transfer(g.balance);

//                 g.balance = 0;
//                 restart(host);
//                 return;
//             }

//             // Set player's turn
//             g.turn = player;

//             // Set time limit for the next move (in seconds), 10 minutes.
//             g.time_limit = block.timestamp + (600);
//         }
//     }

//     function check(
//         address host,
//         uint256 player,
//         uint256 r1,
//         uint256 r2,
//         uint256 r3,
//         uint256 c1,
//         uint256 c2,
//         uint256 c3
//     ) private view returns (bool retVal) {
//         Game storage g = games[host];
//         if (
//             g.board[r1][c1] == player &&
//             g.board[r2][c2] == player &&
//             g.board[r3][c3] == player
//         ) return true;
//     }

//     // Boolean function that verify wheter the board is in a winning condition or not
//     function is_winner(address host, uint256 player)
//         private
//         view
//         returns (bool winner)
//     {
//         // Verify if there's a winning streak on diagonals
//         if (
//             check(host, player, 0, 1, 2, 0, 1, 2) ||
//             check(host, player, 0, 1, 2, 2, 1, 0)
//         ) return true;

//         // Verify if there's a winning streak on rows and columns
//         for (uint256 r = 0; r < 3; r++)
//             if (
//                 check(host, player, r, r, r, 0, 1, 2) ||
//                 check(host, player, 0, 1, 2, r, r, r)
//             ) return true;
//     }

//     // Booleand function that verify wheter the board is full or not
//     // Simply counts number of signs, if thet are 9 then the board is full
//     function is_board_full(address host) private view returns (bool retVal) {
//         Game storage g = games[host];
//         uint256 count = 0;
//         for (uint256 r = 0; r < 3; r++)
//             for (uint256 c = 0; c < 3; c++) if (g.board[r][c] > 0) count++;
//         if (count >= 9) return true;
//     }

// }
