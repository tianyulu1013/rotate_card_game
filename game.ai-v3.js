/**
 * 五行旋转牌 (Five Elements Rotational Cards) - AI Styles Game Engine
 */

const ELEMENTS_DEFINITIONS = {
    0: { name: '木', num: '1', color: 'elem-0' },
    1: { name: '火', num: '3', color: 'elem-1' },
    2: { name: '土', num: '5', color: 'elem-2' },
    3: { name: '金', num: '2', color: 'elem-3' },
    4: { name: '水', num: '4', color: 'elem-4' }
};

const AI_STYLE_DEFINITIONS = {
    fighter: {
        name: '斗士',
        icon: '⚔️',
        description: '偏爱立即翻牌、破盾与贴身进攻'
    },
    fortress: {
        name: '堡垒',
        icon: '🛡️',
        description: '偏爱边角锚点、关键护盾与低暴露阵地'
    },
    combo: {
        name: '机关师',
        icon: '💥',
        description: '偏爱多面接触与完整连锁收益'
    }
};

const AI_STYLE_KEYS = Object.keys(AI_STYLE_DEFINITIONS);

// 🎯 30 张卡牌与初代宝可梦 (Gen 1) 精准对应表
const EXACT_30_CARDS_DEFINITIONS = [
    // 🌟 一、纯色霸体牌 (AAAA) - 御三家与经典担当
    { type: 'AAAA', edges: [1, 1, 1, 1], name: '小火龙', pokeId: 4 },
    { type: 'AAAA', edges: [4, 4, 4, 4], name: '杰尼龟', pokeId: 7 },
    { type: 'AAAA', edges: [0, 0, 0, 0], name: '妙蛙种子', pokeId: 1 },
    { type: 'AAAA', edges: [2, 2, 2, 2], name: '大岩蛇', pokeId: 95 },
    { type: 'AAAA', edges: [3, 3, 3, 3], name: '皮卡丘', pokeId: 25 },

    // 📐 二、双色 L 角牌 (AABB) - 经典双系
    { type: 'AABB', edges: [3, 3, 4, 4], name: '乘龙', pokeId: 131 },
    { type: 'AABB', edges: [4, 4, 0, 0], name: '可达鸭', pokeId: 54 },
    { type: 'AABB', edges: [0, 0, 1, 1], name: '派拉斯特', pokeId: 47 },
    { type: 'AABB', edges: [1, 1, 2, 2], name: '九尾', pokeId: 38 },
    { type: 'AABB', edges: [2, 2, 3, 3], name: '三合一磁怪', pokeId: 82 },

    // ✖️ 三、双色十字牌 (ABAB) - 强力对边双系
    { type: 'ABAB', edges: [3, 1, 3, 1], name: '鸭嘴火兽', pokeId: 126 },
    { type: 'ABAB', edges: [4, 2, 4, 2], name: '呆壳兽', pokeId: 80 },
    { type: 'ABAB', edges: [0, 3, 0, 3], name: '飞天螳螂', pokeId: 123 },
    { type: 'ABAB', edges: [1, 4, 1, 4], name: '暴鲤龙', pokeId: 130 },
    { type: 'ABAB', edges: [2, 0, 2, 0], name: '椰蛋树', pokeId: 103 },

    // 🗡️ 四、三同一异突刺牌 (AAAB) - 进阶突破形态
    { type: 'AAAB', edges: [3, 3, 3, 4], name: '雷丘', pokeId: 26 },
    { type: 'AAAB', edges: [4, 4, 4, 0], name: '卡卡龟', pokeId: 8 },
    { type: 'AAAB', edges: [0, 0, 0, 1], name: '妙蛙草', pokeId: 2 },
    { type: 'AAAB', edges: [1, 1, 1, 2], name: '火恐龙', pokeId: 5 },
    { type: 'AAAB', edges: [2, 2, 2, 3], name: '隆隆石', pokeId: 75 },
    { type: 'AAAB', edges: [3, 3, 3, 1], name: '胡地', pokeId: 65 },
    { type: 'AAAB', edges: [4, 4, 4, 2], name: '水箭龟', pokeId: 9 },
    { type: 'AAAB', edges: [0, 0, 0, 3], name: '妙蛙花', pokeId: 3 },
    { type: 'AAAB', edges: [1, 1, 1, 4], name: '喷火龙', pokeId: 6 },
    { type: 'AAAB', edges: [2, 2, 2, 0], name: '卡拉卡拉', pokeId: 104 },

    // 🌈 五、四异彩虹全能牌 (ABCD) - 进化与神兽
    { type: 'ABCD', edges: [3, 0, 4, 1], name: '伊布', pokeId: 133 },
    { type: 'ABCD', edges: [0, 4, 1, 2], name: '快龙', pokeId: 149 },
    { type: 'ABCD', edges: [4, 1, 2, 3], name: '耿鬼', pokeId: 94 },
    { type: 'ABCD', edges: [1, 2, 3, 0], name: '风速狗', pokeId: 59 },
    { type: 'ABCD', edges: [2, 3, 0, 4], name: '超梦', pokeId: 150 }
];

function doesOvercome(elemA, elemB) {
    return (elemB - elemA + 5) % 5 === 2;
}

function doesGenerate(elemA, elemB) {
    return (elemB - elemA + 5) % 5 === 1;
}

function generateBalanced30Deck() {
    const deck = EXACT_30_CARDS_DEFINITIONS.map((def, idx) => ({
        id: idx + 1,
        type: def.type,
        name: def.name,
        spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${def.pokeId}.png`,
        edges: [...def.edges]
    }));

    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}

class GameEngine {
    constructor() {
        this.boardSize = 4;
        this.enableCombo = true;
        this.firstPlayerChoice = '1';
        this.aiStyleChoice = 'random';
        this.activeAIStyle = 'fighter';
        this.displayMode = 'wuxing'; // 'wuxing' | 'number'
        this.isProcessingAnim = false;
        this.previewState = null;
        this.targetedCell = null; // { r, c }
        this.activeArrow = null;
        this.turnCount = 1;
        this.resetGame();
    }

    resetGame() {
        this.board = Array(4).fill(null).map(() => Array(4).fill(null));
        this.deck = generateBalanced30Deck();
        this.p1Hand = [null, null, null, null, null];
        this.p2Hand = [null, null, null, null, null];
        
        if (this.firstPlayerChoice === 'random') {
            this.currentTurn = Math.random() < 0.5 ? 1 : 2;
        } else {
            this.currentTurn = parseInt(this.firstPlayerChoice);
        }

        this.activeAIStyle = this.aiStyleChoice === 'random'
            ? AI_STYLE_KEYS[Math.floor(Math.random() * AI_STYLE_KEYS.length)]
            : this.aiStyleChoice;

        this.selectedCardIndex = null;
        this.selectedCardRotation = 0;
        this.targetedCell = null;
        this.gameOver = false;
        this.totalPlaced = 0;
        this.isProcessingAnim = false;
        this.previewState = null;
        this.activeArrow = null;
        this.turnCount = 1;
    }

    getElemName(val) {
        if (this.displayMode === 'number') {
            return ELEMENTS_DEFINITIONS[val].num;
        }
        return ELEMENTS_DEFINITIONS[val].name;
    }

    getAIStyleMeta() {
        return AI_STYLE_DEFINITIONS[this.activeAIStyle] || AI_STYLE_DEFINITIONS.fighter;
    }

    async performOpeningDeal(renderCallback, triggerDrawAnimCallback, onLogMsg) {
        this.isProcessingAnim = true;
        onLogMsg('🎴 游戏开始！双方正在抽取 5 张初始手牌...', 'system');

        for (let slot = 0; slot < 5; slot++) {
            if (this.deck.length > 0) {
                if (triggerDrawAnimCallback) {
                    await triggerDrawAnimCallback(1, slot, 180);
                }
                this.p1Hand[slot] = this.deck.pop();
                renderCallback();
            }
            if (this.deck.length > 0) {
                if (triggerDrawAnimCallback) {
                    await triggerDrawAnimCallback(2, slot, 180);
                }
                this.p2Hand[slot] = this.deck.pop();
                renderCallback();
            }
        }

        this.isProcessingAnim = false;
        onLogMsg('✨ 发牌完成！点击手牌选定后落子。', 'system');
        renderCallback();
    }

    getEffectiveEdges(card, rotation) {
        const orig = card.edges;
        const r = (rotation % 4 + 4) % 4;
        return {
            top:    orig[(4 - r) % 4],
            right:  orig[(5 - r) % 4],
            bottom: orig[(6 - r) % 4],
            left:   orig[(7 - r) % 4]
        };
    }

    isValidPlacement(r, c) {
        return this.board[r][c] === null;
    }

    getPreviewOutcome(startR, startC, card, rotation) {
        if (!this.isValidPlacement(startR, startC) || !card) return null;

        const simBoard = Array(4).fill(null).map((_, r) => 
            Array(4).fill(null).map((_, c) => {
                if (!this.board[r][c]) return null;
                return {
                    card: this.board[r][c].card,
                    owner: this.board[r][c].owner,
                    orientation: this.board[r][c].orientation,
                    hasShield: this.board[r][c].hasShield
                };
            })
        );

        const activeOwner = this.currentTurn;
        simBoard[startR][startC] = {
            card: card,
            owner: activeOwner,
            orientation: rotation,
            hasShield: false
        };

        const flipCells = [];
        const shieldCells = [];
        const breakCells = [];
        const visitedKeys = new Set();
        visitedKeys.add(`${startR},${startC}`);

        const chainQueue = [{ r: startR, c: startC }];
        let stepCount = 0;
        let maxChainLevel = 1;

        while (chainQueue.length > 0) {
            const currentCount = chainQueue.length;
            stepCount++;

            if (stepCount > 1 && !this.enableCombo) break;

            const nextLevelQueue = [];

            for (let i = 0; i < currentCount; i++) {
                const pos = chainQueue.shift();
                const sourceCell = simBoard[pos.r][pos.c];
                if (!sourceCell) continue;

                const activeEdges = this.getEffectiveEdges(sourceCell.card, sourceCell.orientation);
                const directions = [
                    { dr: -1, dc: 0, myEdge: activeEdges.top,    theirDir: 'bottom' },
                    { dr: 0, dc: 1, myEdge: activeEdges.right,  theirDir: 'left'   },
                    { dr: 1, dc: 0, myEdge: activeEdges.bottom, theirDir: 'top'    },
                    { dr: 0, dc: -1, myEdge: activeEdges.left,   theirDir: 'right'  }
                ];

                for (const dir of directions) {
                    const nr = pos.r + dir.dr;
                    const nc = pos.c + dir.dc;

                    if (nr >= 0 && nr < 4 && nc >= 0 && nc < 4) {
                        const targetCell = simBoard[nr][nc];
                        if (!targetCell) continue;

                        const targetEdges = this.getEffectiveEdges(targetCell.card, targetCell.orientation);
                        const targetEdgeVal = targetEdges[dir.theirDir];

                        if (targetCell.owner !== sourceCell.owner) {
                            if (doesOvercome(dir.myEdge, targetEdgeVal)) {
                                if (targetCell.hasShield) {
                                    targetCell.hasShield = false;
                                    breakCells.push({ r: nr, c: nc });
                                } else {
                                    targetCell.owner = sourceCell.owner;
                                    targetCell.orientation = (targetCell.orientation + 2) % 4;
                                    flipCells.push({ r: nr, c: nc });
                                    maxChainLevel = Math.max(maxChainLevel, stepCount);

                                    const key = `${nr},${nc}`;
                                    if (!visitedKeys.has(key)) {
                                        visitedKeys.add(key);
                                        nextLevelQueue.push({ r: nr, c: nc });
                                    }

                                    if (doesGenerate(targetEdgeVal, dir.myEdge) && !sourceCell.hasShield) {
                                        sourceCell.hasShield = true;
                                        shieldCells.push({ r: pos.r, c: pos.c });
                                    }
                                }
                            }
                        }
                        else if (targetCell.owner === sourceCell.owner) {
                            if (doesGenerate(dir.myEdge, targetEdgeVal) && !targetCell.hasShield) {
                                targetCell.hasShield = true;
                                shieldCells.push({ r: nr, c: nc });
                            }
                            if (doesGenerate(targetEdgeVal, dir.myEdge) && !sourceCell.hasShield) {
                                sourceCell.hasShield = true;
                                shieldCells.push({ r: pos.r, c: pos.c });
                            }
                        }
                    }
                }
            }

            chainQueue.push(...nextLevelQueue);
        }

        return { flipCells, shieldCells, breakCells, maxChainLevel };
    }

    async executeTurnPlacement(r, c, cardIndex, rotation, onLogMsg, renderCallback, triggerDrawAnimCallback, triggerShieldBeamCallback) {
        if (this.gameOver || this.isProcessingAnim) return false;
        const hand = this.currentTurn === 1 ? this.p1Hand : this.p2Hand;
        if (cardIndex < 0 || cardIndex >= 5 || !hand[cardIndex]) return false;
        if (!this.isValidPlacement(r, c)) return false;

        this.isProcessingAnim = true;
        this.previewState = null;
        this.targetedCell = null;
        
        const card = hand[cardIndex];
        hand[cardIndex] = null;

        const activeOwner = this.currentTurn;
        const isFirstCardOfGame = (this.totalPlaced === 0);

        const boardCell = {
            card: card,
            owner: activeOwner,
            orientation: rotation,
            hasShield: isFirstCardOfGame,
            justFlipped: false,
            shieldBreakAnim: false
        };
        this.board[r][c] = boardCell;
        this.totalPlaced++;

        const playerTag = activeOwner === 1 ? '玩家' : 'AI';
        onLogMsg(`🃏 ${playerTag} 打出 [${card.name}] 落子于 (${r+1}, ${c+1})${isFirstCardOfGame ? ' 🛡️ [先手特权: 附带神圣护盾]' : ''}`, activeOwner);
        renderCallback();

        const chainQueue = [{ r, c }];
        const visitedThisTurn = new Set();
        visitedThisTurn.add(`${r},${c}`);

        let stepCount = 0;

        while (chainQueue.length > 0) {
            const currentCount = chainQueue.length;
            stepCount++;

            if (stepCount > 1 && !this.enableCombo) break;

            const nextLevelQueue = [];

            for (let i = 0; i < currentCount; i++) {
                const pos = chainQueue.shift();
                const sourceCell = this.board[pos.r][pos.c];
                if (!sourceCell) continue;

                const activeEdges = this.getEffectiveEdges(sourceCell.card, sourceCell.orientation);
                const directions = [
                    { dr: -1, dc: 0, myEdge: activeEdges.top,    theirDir: 'bottom' },
                    { dr: 0, dc: 1, myEdge: activeEdges.right,  theirDir: 'left'   },
                    { dr: 1, dc: 0, myEdge: activeEdges.bottom, theirDir: 'top'    },
                    { dr: 0, dc: -1, myEdge: activeEdges.left,   theirDir: 'right'  }
                ];

                for (const dir of directions) {
                    const nr = pos.r + dir.dr;
                    const nc = pos.c + dir.dc;

                    if (nr >= 0 && nr < 4 && nc >= 0 && nc < 4) {
                        const targetCell = this.board[nr][nc];
                        if (!targetCell) continue;

                        const targetEdges = this.getEffectiveEdges(targetCell.card, targetCell.orientation);
                        const targetEdgeVal = targetEdges[dir.theirDir];

                        if (targetCell.owner === sourceCell.owner) {
                            if (doesGenerate(dir.myEdge, targetEdgeVal) && !targetCell.hasShield) {
                                onLogMsg(`🌟 [${this.getElemName(dir.myEdge)}生${this.getElemName(targetEdgeVal)}] 正在为友军 (${nr+1},${nc+1}) 输送护盾！`, activeOwner);
                                if (triggerShieldBeamCallback) {
                                    await triggerShieldBeamCallback(pos.r, pos.c, nr, nc);
                                }
                                targetCell.hasShield = true;
                                renderCallback();
                                await this.sleep(400);
                            }
                            if (doesGenerate(targetEdgeVal, dir.myEdge) && !sourceCell.hasShield) {
                                onLogMsg(`🌟 [${this.getElemName(targetEdgeVal)}生${this.getElemName(dir.myEdge)}] 友军正在为本牌 (${pos.r+1},${pos.c+1}) 输送护盾！`, activeOwner);
                                if (triggerShieldBeamCallback) {
                                    await triggerShieldBeamCallback(nr, nc, pos.r, pos.c);
                                }
                                sourceCell.hasShield = true;
                                renderCallback();
                                await this.sleep(400);
                            }
                        }
                        else if (targetCell.owner !== sourceCell.owner) {
                            if (doesOvercome(dir.myEdge, targetEdgeVal)) {
                                if (targetCell.hasShield) {
                                    targetCell.hasShield = false;
                                    targetCell.shieldBreakAnim = true;
                                    onLogMsg(`🛡️ [护盾抵挡] 敌牌 (${nr+1},${nc+1}) 护盾破碎！`, activeOwner);
                                    renderCallback();
                                    await this.sleep(1000);
                                    targetCell.shieldBreakAnim = false;
                                    renderCallback();
                                } else {
                                    targetCell.owner = sourceCell.owner;
                                    targetCell.orientation = (targetCell.orientation + 2) % 4;
                                    targetCell.justFlipped = true;

                                    const isCombo = stepCount > 1;
                                    onLogMsg(`${isCombo ? '💥 连锁反应！' : '⚔️ '}[${this.getElemName(dir.myEdge)}克${this.getElemName(targetEdgeVal)}] 卡牌 (${nr+1},${nc+1}) 被克翻转 180°！`, activeOwner);
                                    
                                    renderCallback();
                                    await this.sleep(1000);

                                    if (doesGenerate(targetEdgeVal, dir.myEdge) && !sourceCell.hasShield) {
                                        onLogMsg(`🌟 翻转牌滋养 [${this.getElemName(targetEdgeVal)}生${this.getElemName(dir.myEdge)}] 正在输送护盾！`, activeOwner);
                                        if (triggerShieldBeamCallback) {
                                            await triggerShieldBeamCallback(nr, nc, pos.r, pos.c);
                                        }
                                        sourceCell.hasShield = true;
                                        renderCallback();
                                        await this.sleep(400);
                                    }

                                    const key = `${nr},${nc}`;
                                    if (!visitedThisTurn.has(key)) {
                                        visitedThisTurn.add(key);
                                        nextLevelQueue.push({ r: nr, c: nc });
                                    }
                                }
                            }
                        }
                    }
                }
            }

            chainQueue.push(...nextLevelQueue);
        }

        if (this.deck.length > 0) {
            if (triggerDrawAnimCallback) {
                await triggerDrawAnimCallback(activeOwner, cardIndex, 200);
            }
            const drawnCard = this.deck.pop();
            hand[cardIndex] = drawnCard;
            onLogMsg(`🎴 ${playerTag} 从牌堆中补充抽取了 1 张新牌！`, activeOwner);
        }

        this.checkGameOver();
        if (!this.gameOver) {
            this.currentTurn = activeOwner === 1 ? 2 : 1;
            this.selectedCardIndex = null;
            this.selectedCardRotation = 0;
            this.targetedCell = null;
            this.turnCount++;
        }

        this.isProcessingAnim = false;
        renderCallback();
        return true;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getAIMove() {
        const moves = [];
        const hand = this.p2Hand;

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.isValidPlacement(r, c)) {
                    for (let ci = 0; ci < 5; ci++) {
                        if (!hand[ci]) continue;
                        for (let rot = 0; rot < 4; rot++) {
                            const features = this.evaluateMoveFeatures(r, c, hand[ci], rot);
                            const score = this.scoreAIMove(features);
                            moves.push({ r, c, cardIndex: ci, rotation: rot, score, features });
                        }
                    }
                }
            }
        }

        if (moves.length === 0) return null;

        moves.sort((a, b) => b.score - a.score);
        const topScore = moves[0].score;
        const bestMoves = moves.filter(m => m.score === topScore);
        
        return bestMoves[Math.floor(Math.random() * bestMoves.length)];
    }

    evaluateMoveFeatures(r, c, card, rotation) {
        const activeEdges = this.getEffectiveEdges(card, rotation);
        const directions = [
            { dr: -1, dc: 0, myEdge: activeEdges.top,    theirDir: 'bottom' },
            { dr: 0, dc: 1, myEdge: activeEdges.right,  theirDir: 'left'   },
            { dr: 1, dc: 0, myEdge: activeEdges.bottom, theirDir: 'top'    },
            { dr: 0, dc: -1, myEdge: activeEdges.left,   theirDir: 'right'  }
        ];

        let directFlips = 0;
        let directShieldBreaks = 0;
        let friendlyLinks = 0;
        let enemyContacts = 0;
        let emptyExposure = 0;

        directions.forEach(dir => {
            const nr = r + dir.dr;
            const nc = c + dir.dc;
            if (nr >= 0 && nr < 4 && nc >= 0 && nc < 4) {
                const neighbor = this.board[nr][nc];
                if (!neighbor) {
                    emptyExposure++;
                    return;
                }

                const neighborEdges = this.getEffectiveEdges(neighbor.card, neighbor.orientation);
                if (neighbor.owner === 1) {
                    enemyContacts++;
                    if (doesOvercome(dir.myEdge, neighborEdges[dir.theirDir])) {
                        if (neighbor.hasShield) directShieldBreaks++;
                        else directFlips++;
                    }
                } else if (neighbor.owner === 2) {
                    friendlyLinks++;
                }
            }
        });

        const preview = this.getPreviewOutcome(r, c, card, rotation) || {
            flipCells: [],
            shieldCells: [],
            breakCells: [],
            maxChainLevel: 1
        };

        const isCorner = (r === 0 || r === 3) && (c === 0 || c === 3);
        const isEdge = !isCorner && (r === 0 || r === 3 || c === 0 || c === 3);
        const isIsolated = friendlyLinks === 0 && enemyContacts === 0;
        const uniqueElements = new Set(card.edges).size;
        const phase = this.totalPlaced < 5 ? 'opening' : (this.totalPlaced < 12 ? 'middle' : 'end');

        let shieldStrategicValue = 0;
        const uniqueShieldCells = new Set();
        preview.shieldCells.forEach(pos => {
            const key = `${pos.r},${pos.c}`;
            if (uniqueShieldCells.has(key)) return;
            uniqueShieldCells.add(key);
            shieldStrategicValue += this.evaluateShieldPositionValue(pos.r, pos.c, r, c);
        });

        return {
            r,
            c,
            directFlips,
            directShieldBreaks,
            totalChainFlips: preview.flipCells.length,
            totalShieldBreaks: preview.breakCells.length,
            shieldsGranted: uniqueShieldCells.size,
            shieldStrategicValue,
            maxChainLevel: preview.maxChainLevel,
            friendlyLinks,
            enemyContacts,
            emptyExposure,
            isCorner,
            isEdge,
            isIsolated,
            uniqueElements,
            phase
        };
    }

    evaluateShieldPositionValue(r, c, placedR, placedC) {
        const directions = [
            { dr: -1, dc: 0 },
            { dr: 0, dc: 1 },
            { dr: 1, dc: 0 },
            { dr: 0, dc: -1 }
        ];

        let emptyNeighbors = 0;
        let friendlyNeighbors = 0;

        directions.forEach(dir => {
            const nr = r + dir.dr;
            const nc = c + dir.dc;
            if (nr < 0 || nr >= 4 || nc < 0 || nc >= 4) return;

            if (nr === placedR && nc === placedC) {
                friendlyNeighbors++;
                return;
            }

            const neighbor = this.board[nr][nc];
            if (!neighbor) emptyNeighbors++;
            else if (neighbor.owner === 2) friendlyNeighbors++;
        });

        const isCorner = (r === 0 || r === 3) && (c === 0 || c === 3);
        const isEdge = !isCorner && (r === 0 || r === 3 || c === 0 || c === 3);
        const positionRisk = isCorner ? 0.5 : (isEdge ? 1 : 2);

        return 1 + emptyNeighbors * 1.5 + friendlyNeighbors * 1.25 + positionRisk;
    }

    scoreAIMove(features) {
        const {
            directFlips,
            directShieldBreaks,
            totalChainFlips,
            totalShieldBreaks,
            shieldsGranted,
            shieldStrategicValue,
            maxChainLevel,
            friendlyLinks,
            enemyContacts,
            emptyExposure,
            isCorner,
            isEdge,
            isIsolated,
            uniqueElements,
            phase
        } = features;

        const extraChainFlips = Math.max(0, totalChainFlips - directFlips);
        const phasePositionWeight = phase === 'opening' ? 1 : (phase === 'middle' ? 0.55 : 0.1);
        const endgameFlipBonus = phase === 'end' ? totalChainFlips * 9 : 0;

        if (this.activeAIStyle === 'fortress') {
            return (
                directFlips * 7 +
                extraChainFlips * 6 +
                totalShieldBreaks * 4 +
                shieldsGranted * 4 +
                shieldStrategicValue * 3.5 +
                friendlyLinks * 5 +
                (isCorner ? 11 : (isEdge ? 5 : 0)) * phasePositionWeight -
                emptyExposure * (phase === 'opening' ? 2.5 : 1.25) -
                (phase === 'opening' ? uniqueElements * 0.8 : 0) +
                endgameFlipBonus
            );
        }

        if (this.activeAIStyle === 'combo') {
            return (
                directFlips * 9 +
                extraChainFlips * 18 +
                maxChainLevel * 6 +
                directShieldBreaks * 5 +
                shieldStrategicValue * 1.5 +
                enemyContacts * 2.5 +
                (!isEdge && !isCorner ? 3 : 0) -
                (isIsolated ? 2 : 0) +
                endgameFlipBonus
            );
        }

        return (
            directFlips * 15 +
            directShieldBreaks * 8 +
            shieldsGranted * 6 +
            extraChainFlips * 5 +
            (isCorner && isIsolated ? 3 : 0) +
            endgameFlipBonus
        );
    }

    checkGameOver() {
        const isFull = this.totalPlaced >= 16;
        const p1HasNoMoves = this.p1Hand.every(c => c === null) && this.deck.length === 0;
        const p2HasNoMoves = this.p2Hand.every(c => c === null) && this.deck.length === 0;

        if (isFull || (p1HasNoMoves && p2HasNoMoves)) {
            this.gameOver = true;
        }
    }

    getScores() {
        let p1 = 0;
        let p2 = 0;
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.board[r][c]) {
                    if (this.board[r][c].owner === 1) p1++;
                    else if (this.board[r][c].owner === 2) p2++;
                }
            }
        }
        return { p1, p2 };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new GameEngine();

    const boardGridEl = document.getElementById('board-grid');
    const playerHandEl = document.getElementById('player-hand');
    const aiHandEl = document.getElementById('ai-hand');
    const deckStackEl = document.getElementById('deck-stack');
    const animationOverlayEl = document.getElementById('animation-overlay');
    const turnIndicatorEl = document.getElementById('turn-indicator');
    const turnTextEl = document.getElementById('turn-text');
    const p1ScoreEl = document.getElementById('p1-card-count');
    const p2ScoreEl = document.getElementById('p2-card-count');
    const aiStyleLabelEl = document.getElementById('ai-style-label');
    const aiHandTitleEl = document.getElementById('ai-hand-title');
    const deckRemainingEl = document.getElementById('deck-remaining');
    const btnRotate = document.getElementById('btn-rotate');
    const btnRestart = document.getElementById('btn-restart');
    const btnOpenRules = document.getElementById('btn-open-rules');
    const selectElementModeEl = document.getElementById('select-element-mode');
    const selectFirstPlayerEl = document.getElementById('select-first-player');
    const selectAIStyleEl = document.getElementById('select-ai-style');
    const toggleComboEl = document.getElementById('toggle-combo');
    const combatBannerEl = document.getElementById('combat-banner');
    const logListEl = document.getElementById('log-list');
    const btnClearLog = document.getElementById('btn-clear-log');
    const elementsLegendEl = document.getElementById('elements-legend');
    const mobileElementsLegendEl = document.getElementById('mobile-elements-legend');

    // ⚙️ 手机端折叠设置抽屉节点
    const btnOpenMobileSettings = document.getElementById('btn-open-mobile-settings');
    const mobileSettingsModalEl = document.getElementById('mobile-settings-modal');
    const btnCloseMobileSettings = document.getElementById('btn-close-mobile-settings');
    const btnCloseMobileSettingsConfirm = document.getElementById('btn-close-mobile-settings-confirm');
    const btnModalOpenRules = document.getElementById('btn-modal-open-rules');
    const btnModalOpenLog = document.getElementById('btn-modal-open-log');
    const selectElementModeMobile = document.getElementById('select-element-mode-mobile');
    const selectFirstPlayerMobile = document.getElementById('select-first-player-mobile');
    const selectAIStyleMobile = document.getElementById('select-ai-style-mobile');
    const toggleComboMobile = document.getElementById('toggle-combo-mobile');
    const btnModalRestart = document.getElementById('btn-modal-restart');
    
    // 📖 规则书弹窗节点
    const rulebookModalEl = document.getElementById('rulebook-modal');
    const btnCloseRules = document.getElementById('btn-close-rules');
    const btnUnderstood = document.getElementById('btn-understood');

    // 📜 手机日志弹窗节点
    const mobileLogModalEl = document.getElementById('mobile-log-modal');
    const btnCloseLogModal = document.getElementById('btn-close-log-modal');
    const btnCloseLogModalConfirm = document.getElementById('btn-close-log-modal-confirm');
    const btnClearLogMobile = document.getElementById('btn-clear-log-mobile');
    const mobileLogListContainerEl = document.getElementById('mobile-log-list-container');

    // 结算弹窗节点
    const modalEl = document.getElementById('game-modal');
    const modalTitleEl = document.getElementById('modal-title');
    const modalBodyEl = document.getElementById('modal-body');
    const modalBtnRestart = document.getElementById('modal-btn-restart');

    // 🔒 页面初始化：确保所有 Modal 弹窗均带有 hidden 类（网页端绝不默认开启规则书）
    [rulebookModalEl, mobileSettingsModalEl, mobileLogModalEl, modalEl].forEach(m => {
        if (m) m.classList.add('hidden');
    });

    initGameFlow();

    // 🔒 通用关闭弹窗辅助函数（兼容 click 与 touchend）
    function hideModal(modal) {
        if (modal) modal.classList.add('hidden');
    }

    function showModal(modal) {
        if (modal) modal.classList.remove('hidden');
    }

    function bindDismiss(el, targetModal) {
        if (!el || !targetModal) return;
        const handler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            hideModal(targetModal);
        };
        el.addEventListener('click', handler);
        el.addEventListener('touchend', handler);
    }

    // 🌟 所有弹窗背景与按钮双重绑定
    [rulebookModalEl, mobileSettingsModalEl, mobileLogModalEl, modalEl].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) hideModal(modal);
            });
        }
    });

    bindDismiss(btnCloseRules, rulebookModalEl);
    bindDismiss(btnUnderstood, rulebookModalEl);
    bindDismiss(btnCloseMobileSettings, mobileSettingsModalEl);
    bindDismiss(btnCloseMobileSettingsConfirm, mobileSettingsModalEl);
    bindDismiss(btnCloseLogModal, mobileLogModalEl);
    bindDismiss(btnCloseLogModalConfirm, mobileLogModalEl);

    // ⚙️ 手机端折叠设置弹窗交互
    btnOpenMobileSettings.addEventListener('click', () => {
        selectElementModeMobile.value = game.displayMode;
        selectFirstPlayerMobile.value = game.firstPlayerChoice;
        selectAIStyleMobile.value = game.aiStyleChoice;
        toggleComboMobile.checked = game.enableCombo;
        showModal(mobileSettingsModalEl);
    });

    btnModalOpenRules.addEventListener('click', () => {
        hideModal(mobileSettingsModalEl);
        showModal(rulebookModalEl);
    });

    btnModalOpenLog.addEventListener('click', () => {
        hideModal(mobileSettingsModalEl);
        showModal(mobileLogModalEl);
    });

    selectElementModeMobile.addEventListener('change', (e) => {
        selectElementModeEl.value = e.target.value;
        game.displayMode = e.target.value;
        const msg = game.displayMode === 'number' ? '🔢 已切换至数字模式 (大压小 5克4克3克2克1克5)' : '☯️ 已切换至五行模式 (木火土金水)';
        showBanner(msg);
        addLogEntry(msg, 'system');
        render();
    });

    selectFirstPlayerMobile.addEventListener('change', (e) => {
        selectFirstPlayerEl.value = e.target.value;
        game.firstPlayerChoice = e.target.value;
        const logMsg = `⚙️ 游戏重置，先后手调整为：${selectFirstPlayerEl.options[selectFirstPlayerEl.selectedIndex].text}`;
        logListEl.innerHTML = `<div class="log-entry log-system">${logMsg}</div>`;
        mobileLogListContainerEl.innerHTML = `<div class="log-entry log-system">${logMsg}</div>`;
        hideModal(mobileSettingsModalEl);
        initGameFlow();
    });

    selectAIStyleMobile.addEventListener('change', (e) => {
        applyAIStyleChoice(e.target.value);
        hideModal(mobileSettingsModalEl);
    });

    toggleComboMobile.addEventListener('change', (e) => {
        toggleComboEl.checked = e.target.checked;
        game.enableCombo = e.target.checked;
        const msg = game.enableCombo ? '⚡ 连锁翻牌模式已开启' : '🛑 连锁翻牌模式已关闭';
        showBanner(msg);
        addLogEntry(msg, 'system');
    });

    btnModalRestart.addEventListener('click', () => {
        hideModal(mobileSettingsModalEl);
        const logMsg = '☯️ 新游戏开始！准备进行开局发牌仪式...';
        logListEl.innerHTML = `<div class="log-entry log-system">${logMsg}</div>`;
        mobileLogListContainerEl.innerHTML = `<div class="log-entry log-system">${logMsg}</div>`;
        initGameFlow();
    });

    btnClearLogMobile.addEventListener('click', () => {
        logListEl.innerHTML = '<div class="log-entry log-system">📜 历史日志已清空。</div>';
        mobileLogListContainerEl.innerHTML = '<div class="log-entry log-system">📜 历史日志已清空。</div>';
    });

    // 🔢 桌面模式切换绑定 (五行 / 数字大压小 5克4克3克2克1克5)
    selectElementModeEl.addEventListener('change', (e) => {
        game.displayMode = e.target.value;
        const msg = game.displayMode === 'number' ? '🔢 已切换至数字模式 (相克: 大压小 5克4克3克2克1克5)' : '☯️ 已切换至五行模式 (木火土金水)';
        showBanner(msg);
        addLogEntry(msg, 'system');
        render();
    });

    btnOpenRules.addEventListener('click', () => {
        showModal(rulebookModalEl);
    });

    selectFirstPlayerEl.addEventListener('change', (e) => {
        game.firstPlayerChoice = e.target.value;
        const logMsg = `⚙️ 游戏重置，先后手调整为：${selectFirstPlayerEl.options[selectFirstPlayerEl.selectedIndex].text}`;
        logListEl.innerHTML = `<div class="log-entry log-system">${logMsg}</div>`;
        mobileLogListContainerEl.innerHTML = `<div class="log-entry log-system">${logMsg}</div>`;
        initGameFlow();
    });

    selectAIStyleEl.addEventListener('change', (e) => {
        applyAIStyleChoice(e.target.value);
    });

    toggleComboEl.addEventListener('change', (e) => {
        game.enableCombo = e.target.checked;
        const msg = game.enableCombo ? '⚡ 连锁翻牌模式已开启' : '🛑 连锁翻牌模式已关闭';
        showBanner(msg);
        addLogEntry(msg, 'system');
    });

    btnClearLog.addEventListener('click', () => {
        logListEl.innerHTML = '<div class="log-entry log-system">📜 历史日志已清空。</div>';
        mobileLogListContainerEl.innerHTML = '<div class="log-entry log-system">📜 历史日志已清空。</div>';
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'r' || e.key === 'R') {
            rotateSelectedCard();
        }
    });

    btnRotate.addEventListener('click', rotateSelectedCard);
    btnRestart.addEventListener('click', () => { 
        const logMsg = '☯️ 新游戏开始！准备进行开局发牌仪式...';
        logListEl.innerHTML = `<div class="log-entry log-system">${logMsg}</div>`;
        mobileLogListContainerEl.innerHTML = `<div class="log-entry log-system">${logMsg}</div>`;
        initGameFlow(); 
    });
    
    modalBtnRestart.addEventListener('click', () => {
        hideModal(modalEl);
        const logMsg = '☯️ 新游戏开始！准备进行开局发牌仪式...';
        logListEl.innerHTML = `<div class="log-entry log-system">${logMsg}</div>`;
        mobileLogListContainerEl.innerHTML = `<div class="log-entry log-system">${logMsg}</div>`;
        initGameFlow();
    });

    function applyAIStyleChoice(choice) {
        game.aiStyleChoice = choice;
        selectAIStyleEl.value = choice;
        selectAIStyleMobile.value = choice;

        const choiceText = choice === 'random'
            ? '🎲 随机风格'
            : `${AI_STYLE_DEFINITIONS[choice].icon} ${AI_STYLE_DEFINITIONS[choice].name}`;
        const logMsg = `🤖 游戏重置，AI 风格调整为：${choiceText}`;
        logListEl.innerHTML = `<div class="log-entry log-system">${logMsg}</div>`;
        mobileLogListContainerEl.innerHTML = `<div class="log-entry log-system">${logMsg}</div>`;
        initGameFlow();
    }

    async function initGameFlow() {
        game.resetGame();
        render();
        const aiStyle = game.getAIStyleMeta();
        addLogEntry(`🤖 本局 AI：${aiStyle.icon} ${aiStyle.name}型 · ${aiStyle.description}`, 'system');
        await game.performOpeningDeal(
            () => render(),
            (owner, slotIdx, duration) => triggerDrawFlyingAnim(owner, slotIdx, duration),
            (msg, type) => {
                showBanner(msg);
                addLogEntry(msg, type);
            }
        );
        checkAIFirstTurn();
    }

    function rotateSelectedCard() {
        if (game.selectedCardIndex !== null && game.currentTurn === 1 && !game.isProcessingAnim) {
            game.selectedCardRotation = (game.selectedCardRotation + 1) % 4;
            game.targetedCell = null;
            game.previewState = null;
            renderPlayerHand();
            renderBoard();
        }
    }

    function checkAIFirstTurn() {
        if (game.currentTurn === 2 && !game.gameOver) {
            setTimeout(processAITurn, 800);
        }
    }

    function triggerDrawFlyingAnim(targetOwner, slotIdx = 0, durationMs = 180) {
        return new Promise(resolve => {
            const stackRect = deckStackEl.getBoundingClientRect();
            const targetContainer = targetOwner === 1 ? playerHandEl : aiHandEl;
            
            const slots = targetContainer.children;
            let targetRect = targetContainer.getBoundingClientRect();
            if (slots && slots[slotIdx]) {
                targetRect = slots[slotIdx].getBoundingClientRect();
            }

            const flyCard = document.createElement('div');
            flyCard.className = 'card card-back-pokeball drawing-fly-card';
            flyCard.style.width = '90px';
            flyCard.style.height = '124px';
            flyCard.style.left = `${stackRect.left + 5}px`;
            flyCard.style.top = `${stackRect.top + 5}px`;
            flyCard.style.transition = `all ${durationMs}ms cubic-bezier(0.25, 1, 0.5, 1)`;
            flyCard.innerHTML = `
                <div class="pokeball-button">
                    <div class="pokeball-inner-core"></div>
                </div>
            `;

            animationOverlayEl.appendChild(flyCard);

            requestAnimationFrame(() => {
                flyCard.style.left = `${targetRect.left}px`;
                flyCard.style.top = `${targetRect.top}px`;
                flyCard.style.transform = 'scale(1)';
                flyCard.style.opacity = '1';
            });

            setTimeout(() => {
                flyCard.remove();
                resolve();
            }, durationMs);
        });
    }

    function triggerShieldBeamAnim(fromR, fromC, toR, toC, durationMs = 450) {
        return new Promise(resolve => {
            const fromIdx = fromR * 4 + fromC;
            const toIdx = toR * 4 + toC;

            const fromCellEl = boardGridEl.children[fromIdx];
            const toCellEl = boardGridEl.children[toIdx];

            if (!fromCellEl || !toCellEl) return resolve();

            const fromRect = fromCellEl.getBoundingClientRect();
            const toRect = toCellEl.getBoundingClientRect();

            const startX = fromRect.left + fromRect.width / 2 - 21;
            const startY = fromRect.top + fromRect.height / 2 - 21;

            const endX = toRect.left + toRect.width / 2 - 21;
            const endY = toRect.top + toRect.height / 2 - 21;

            const particle = document.createElement('div');
            particle.className = 'shield-beam-particle';
            particle.textContent = '🛡️';
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;

            animationOverlayEl.appendChild(particle);

            requestAnimationFrame(() => {
                particle.style.left = `${endX}px`;
                particle.style.top = `${endY}px`;
                particle.style.transform = 'scale(1.2)';
            });

            setTimeout(() => {
                particle.remove();
                resolve();
            }, durationMs);
        });
    }

    function addLogEntry(text, ownerType) {
        const entry = document.createElement('div');
        let cls = 'log-system';
        if (ownerType === 1) cls = 'log-p1';
        else if (ownerType === 2) cls = 'log-p2';

        entry.className = `log-entry ${cls}`;
        entry.textContent = text;

        const mobileEntry = entry.cloneNode(true);

        logListEl.appendChild(entry);
        logListEl.scrollTop = logListEl.scrollHeight;

        mobileLogListContainerEl.appendChild(mobileEntry);
        mobileLogListContainerEl.scrollTop = mobileLogListContainerEl.scrollHeight;
    }

    function showBanner(msg) {
        combatBannerEl.textContent = msg;
        combatBannerEl.classList.remove('hidden');
        setTimeout(() => {
            if (!game.isProcessingAnim) combatBannerEl.classList.add('hidden');
        }, 2500);
    }

    function render() {
        renderBoard();
        renderPlayerHand();
        renderAIHand();
        renderLegend();
        renderStatus();
    }

    function renderLegend() {
        let legendHtml;
        if (game.displayMode === 'number') {
            legendHtml = `
                <div class="legend-row">
                    <span class="legend-label">⚔️ 相克 (大压小):</span>
                    <span class="elem-tag elem-earth">5</span><span class="arrow">→</span>
                    <span class="elem-tag elem-water">4</span><span class="arrow">→</span>
                    <span class="elem-tag elem-fire">3</span><span class="arrow">→</span>
                    <span class="elem-tag elem-metal">2</span><span class="arrow">→</span>
                    <span class="elem-tag elem-wood">1</span><span class="arrow">→</span>
                    <span class="elem-tag elem-earth">5</span>
                </div>
                <div class="legend-row">
                    <span class="legend-label">🌟 相生 (隔位生):</span>
                    <span class="elem-tag elem-wood">1</span><span class="arrow">→</span>
                    <span class="elem-tag elem-fire">3</span><span class="arrow">→</span>
                    <span class="elem-tag elem-earth">5</span><span class="arrow">→</span>
                    <span class="elem-tag elem-metal">2</span><span class="arrow">→</span>
                    <span class="elem-tag elem-water">4</span><span class="arrow">→</span>
                    <span class="elem-tag elem-wood">1</span>
                </div>
            `;
        } else {
            legendHtml = `
                <div class="legend-row">
                    <span class="legend-label">🌟 相生图谱 (护盾):</span>
                    <span class="elem-tag elem-wood">🌿木</span><span class="arrow">→</span>
                    <span class="elem-tag elem-fire">🔥火</span><span class="arrow">→</span>
                    <span class="elem-tag elem-earth">⛰️土</span><span class="arrow">→</span>
                    <span class="elem-tag elem-metal">⚔️金</span><span class="arrow">→</span>
                    <span class="elem-tag elem-water">💧水</span><span class="arrow">→</span>
                    <span class="elem-tag elem-wood">🌿木</span>
                </div>
                <div class="legend-row">
                    <span class="legend-label">⚔️ 相克图谱 (翻牌):</span>
                    <span class="elem-tag elem-wood">🌿木</span><span class="arrow">→</span>
                    <span class="elem-tag elem-earth">⛰️土</span><span class="arrow">→</span>
                    <span class="elem-tag elem-water">💧水</span><span class="arrow">→</span>
                    <span class="elem-tag elem-fire">🔥火</span><span class="arrow">→</span>
                    <span class="elem-tag elem-metal">⚔️金</span><span class="arrow">→</span>
                    <span class="elem-tag elem-wood">🌿木</span>
                </div>
            `;
        }

        elementsLegendEl.innerHTML = legendHtml;
        mobileElementsLegendEl.innerHTML = legendHtml;
    }

    function renderBoard() {
        boardGridEl.innerHTML = '';

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const cellEl = document.createElement('div');
                cellEl.className = 'cell';

                const isValid = game.currentTurn === 1 && 
                                game.selectedCardIndex !== null && 
                                !game.isProcessingAnim &&
                                game.isValidPlacement(r, c);

                const isTargeted = game.targetedCell && game.targetedCell.r === r && game.targetedCell.c === c;

                if (isValid) {
                    cellEl.classList.add('valid-target');
                    if (isTargeted) {
                        cellEl.classList.add('targeted-cell-active');
                    }
                    
                    cellEl.addEventListener('mouseenter', () => {
                        if (game.selectedCardIndex !== null && game.currentTurn === 1 && !game.targetedCell) {
                            const card = game.p1Hand[game.selectedCardIndex];
                            game.previewState = game.getPreviewOutcome(r, c, card, game.selectedCardRotation);
                            applyPreviewUI(r, c);
                        }
                    });

                    cellEl.addEventListener('mouseleave', () => {
                        if (!game.targetedCell) {
                            game.previewState = null;
                            clearPreviewUI();
                        }
                    });

                    cellEl.addEventListener('click', () => handleCellClick(r, c));
                }

                const boardCell = game.board[r][c];
                if (boardCell) {
                    const cardEl = createCardDOM(boardCell.card, boardCell.owner, boardCell.orientation, boardCell.hasShield, false);
                    if (boardCell.justFlipped) {
                        cardEl.classList.add('flip-anim-180');
                        boardCell.justFlipped = false;
                    }
                    if (boardCell.shieldBreakAnim) {
                        cardEl.classList.add('shield-break-anim');
                        boardCell.shieldBreakAnim = false;
                    }
                    cellEl.appendChild(cardEl);
                }

                boardGridEl.appendChild(cellEl);
            }
        }

        if (game.previewState) {
            applyPreviewUIState();
        }
    }

    function applyPreviewUI(hoverR, hoverC) {
        clearPreviewUI();
        if (!game.previewState) return;

        const outcome = game.previewState;
        let msg = `🔮 [预判选定]: `;
        const parts = [];
        if (outcome.maxChainLevel > 1) parts.push(`触发 ${outcome.maxChainLevel} 级连锁`);
        if (outcome.flipCells.length > 0) parts.push(`翻转 ${outcome.flipCells.length} 张敌牌`);
        if (outcome.shieldCells.length > 0) parts.push(`加持 ${outcome.shieldCells.length} 个护盾`);
        if (outcome.breakCells.length > 0) parts.push(`击碎 ${outcome.breakCells.length} 个敌方护盾`);

        if (parts.length === 0) msg += `平局无改变`;
        else msg += parts.join('，');

        msg += ` (再次点击确认落子)`;

        showBanner(msg);
        applyPreviewUIState();
    }

    function applyPreviewUIState() {
        if (!game.previewState) return;
        const outcome = game.previewState;

        outcome.flipCells.forEach(pos => {
            const idx = pos.r * 4 + pos.c;
            const cellEl = boardGridEl.children[idx];
            if (cellEl && cellEl.firstElementChild) {
                cellEl.firstElementChild.classList.add('will-flip-preview');
            }
        });

        outcome.shieldCells.forEach(pos => {
            const idx = pos.r * 4 + pos.c;
            const cellEl = boardGridEl.children[idx];
            if (cellEl && cellEl.firstElementChild) {
                cellEl.firstElementChild.classList.add('will-shield-preview');
            }
        });

        outcome.breakCells.forEach(pos => {
            const idx = pos.r * 4 + pos.c;
            const cellEl = boardGridEl.children[idx];
            if (cellEl && cellEl.firstElementChild) {
                cellEl.firstElementChild.classList.add('will-flip-preview');
            }
        });
    }

    function clearPreviewUI() {
        const cards = boardGridEl.querySelectorAll('.card');
        cards.forEach(card => {
            card.classList.remove('will-flip-preview', 'will-shield-preview');
        });
    }

    async function handleCellClick(r, c) {
        if (game.selectedCardIndex === null || game.currentTurn !== 1 || game.isProcessingAnim) return;

        const isAlreadyTargeted = game.targetedCell && game.targetedCell.r === r && game.targetedCell.c === c;

        if (!isAlreadyTargeted) {
            game.targetedCell = { r, c };
            const card = game.p1Hand[game.selectedCardIndex];
            game.previewState = game.getPreviewOutcome(r, c, card, game.selectedCardRotation);
            applyPreviewUI(r, c);
            renderBoard();
        } else {
            const success = await game.executeTurnPlacement(
                r, c, game.selectedCardIndex, game.selectedCardRotation,
                (msg, owner) => {
                    showBanner(msg);
                    addLogEntry(msg, owner);
                },
                () => render(),
                (owner, slotIdx, duration) => triggerDrawFlyingAnim(owner, slotIdx, duration),
                (fromR, fromC, toR, toC) => triggerShieldBeamAnim(fromR, fromC, toR, toC)
            );

            if (success && !game.gameOver && game.currentTurn === 2) {
                setTimeout(processAITurn, 1000);
            }
        }
    }

    async function processAITurn() {
        if (game.gameOver || game.currentTurn !== 2 || game.isProcessingAnim) return;

        const aiMove = game.getAIMove();
        if (aiMove) {
            await game.executeTurnPlacement(
                aiMove.r, aiMove.c, aiMove.cardIndex, aiMove.rotation,
                (msg, owner) => {
                    showBanner(msg);
                    addLogEntry(msg, owner);
                },
                () => render(),
                (owner, slotIdx, duration) => triggerDrawFlyingAnim(owner, slotIdx, duration),
                (fromR, fromC, toR, toC) => triggerShieldBeamAnim(fromR, fromC, toR, toC)
            );
        }
    }

    function renderPlayerHand() {
        playerHandEl.innerHTML = '';
        for (let slot = 0; slot < 5; slot++) {
            const card = game.p1Hand[slot];
            if (card) {
                const isSelected = game.selectedCardIndex === slot;
                const rotation = isSelected ? game.selectedCardRotation : 0;

                const wrapper = document.createElement('div');
                wrapper.className = `card-wrapper ${isSelected ? 'selected' : ''}`;
                
                const cardEl = createCardDOM(card, 1, rotation, false, true);
                wrapper.appendChild(cardEl);

                wrapper.addEventListener('click', () => {
                    if (game.currentTurn === 1 && !game.isProcessingAnim) {
                        if (game.selectedCardIndex === slot) {
                            game.selectedCardRotation = (game.selectedCardRotation + 1) % 4;
                        } else {
                            game.selectedCardIndex = slot;
                            game.selectedCardRotation = 0;
                        }
                        game.targetedCell = null;
                        game.previewState = null;
                        btnRotate.disabled = false;
                        render();
                    }
                });

                playerHandEl.appendChild(wrapper);
            } else {
                const placeholder = document.createElement('div');
                placeholder.className = 'hand-slot-placeholder';
                playerHandEl.appendChild(placeholder);
            }
        }

        btnRotate.disabled = (game.selectedCardIndex === null || game.currentTurn !== 1 || game.isProcessingAnim);
    }

    function renderAIHand() {
        aiHandEl.innerHTML = '';
        for (let slot = 0; slot < 5; slot++) {
            const card = game.p2Hand[slot];
            if (card) {
                const cardWrapper = document.createElement('div');
                cardWrapper.className = 'card-wrapper';
                
                const cardEl = document.createElement('div');
                cardEl.className = 'card card-back-pokeball';
                cardEl.innerHTML = `
                    <div class="pokeball-button">
                        <div class="pokeball-inner-core"></div>
                    </div>
                `;

                cardWrapper.appendChild(cardEl);
                aiHandEl.appendChild(cardWrapper);
            } else {
                const placeholder = document.createElement('div');
                placeholder.className = 'hand-slot-placeholder';
                aiHandEl.appendChild(placeholder);
            }
        }
    }

    function renderStatus() {
        const scores = game.getScores();
        const aiStyle = game.getAIStyleMeta();
        p1ScoreEl.textContent = scores.p1;
        p2ScoreEl.textContent = scores.p2;
        aiStyleLabelEl.textContent = `AI·${aiStyle.name}`;
        aiHandTitleEl.textContent = `${aiStyle.icon} AI · ${aiStyle.name}`;
        deckRemainingEl.textContent = game.deck.length;

        if (game.currentTurn === 1) {
            turnIndicatorEl.className = 'turn-indicator turn-p1';
            turnTextEl.textContent = game.isProcessingAnim ? '发牌/动画播放中...' : '玩家回合 (选择手牌落子)';
        } else {
            turnIndicatorEl.className = 'turn-indicator turn-p2';
            turnTextEl.textContent = game.isProcessingAnim ? 'AI 连锁计算中...' : 'AI 思考中...';
        }

        if (game.gameOver) {
            showEndGameModal(scores);
        }
    }

    function createCardDOM(card, owner, rotation, hasShield, isHand = false) {
        const cardEl = document.createElement('div');
        cardEl.className = `card owner-p${owner} ${hasShield ? 'has-shield' : ''}`;
        
        const activeEdges = game.getEffectiveEdges(card, rotation);

        cardEl.innerHTML = `
            ${isHand ? `<div class="card-top-name-bar">${card.name}</div>` : ''}
            <div class="card-body-content">
                ${hasShield ? '<div class="shield-icon">🛡️</div>' : ''}
                <div class="edge-badge edge-top ${ELEMENTS_DEFINITIONS[activeEdges.top].color}">${game.getElemName(activeEdges.top)}</div>
                <div class="edge-badge edge-right ${ELEMENTS_DEFINITIONS[activeEdges.right].color}">${game.getElemName(activeEdges.right)}</div>
                <div class="edge-badge edge-bottom ${ELEMENTS_DEFINITIONS[activeEdges.bottom].color}">${game.getElemName(activeEdges.bottom)}</div>
                <div class="edge-badge edge-left ${ELEMENTS_DEFINITIONS[activeEdges.left].color}">${game.getElemName(activeEdges.left)}</div>
                
                <div class="card-sprite-container">
                    <img class="card-sprite-img" src="${card.spriteUrl}" alt="${card.name}" />
                </div>
            </div>
        `;

        return cardEl;
    }

    function showEndGameModal(scores) {
        showModal(modalEl);
        if (scores.p1 > scores.p2) {
            modalTitleEl.textContent = '🎉 恭喜大获全胜！';
            modalBodyEl.innerHTML = `你在 4×4 棋盘中最终控制了 <b style="color:#2563eb;font-size:1.4rem">${scores.p1}</b> 张牌！<br>AI 仅控制了 ${scores.p2} 张牌。`;
            addLogEntry(`🎉 游戏结束，玩家以 ${scores.p1}:${scores.p2} 大获全胜！`, 1);
        } else if (scores.p2 > scores.p1) {
            modalTitleEl.textContent = '💔 遗憾惜败！';
            modalBodyEl.innerHTML = `AI 控制了 <b style="color:#dc2626;font-size:1.4rem">${scores.p2}</b> 张牌。<br>你控制了 ${scores.p1} 张牌，再接再励！`;
            addLogEntry(`💔 游戏结束，AI 以 ${scores.p2}:${scores.p1} 获胜！`, 2);
        } else {
            modalTitleEl.textContent = '🤝 势均力敌 - 平局！';
            modalBodyEl.innerHTML = `双方各自控制了 <b>${scores.p1}</b> 张牌！`;
            addLogEntry(`🤝 游戏结束，双方 ${scores.p1}:${scores.p2} 战平！`, 'system');
        }
    }
});
