(() => {
    const cardId = 'family_plus';
    const createdAt = date => `${date}T12:00:00.000Z`;
    const card = (id, issuer, name, statementDay, dueDay, creditLimit, limitGroup, sortOrder, extra={}) => ({
        id, issuer, name, statementDay, dueDay, creditLimit, limitGroup, sortOrder,
        outstanding: 0, rollover: false, active: true, updatedAt: new Date().toISOString(), ...extra
    });
    const topup = (date, walletId, amount, note) => ({
        id: `seed_${date}_${walletId}_${String(amount).replace('.', '_')}_${Math.random().toString(36).slice(2, 6)}`,
        date,
        type: 'topup',
        cardId,
        walletId,
        amount,
        fee: 0,
        chargedAmount: 0,
        transferAmount: 0,
        cashDelta: 0,
        debtDelta: 0,
        walletDelta: 0,
        note,
        createdAt: createdAt(date)
    });

    const events = [];
    const addSeries = (month, walletId, amounts, note, startDay) => {
        amounts.forEach((amount, index) => {
            const day = String(Math.min(28, startDay + index)).padStart(2, '0');
            events.push(topup(`${month}-${day}`, walletId, amount, note));
        });
    };

    addSeries('2026-05', 'wallet_nine', [10000, 10000, 10000, 10000, 9500.75], 'May opening history: cycle completed', 1);
    addSeries('2026-05', 'wallet_new', [10000, 10000, 10000, 10000, 10000], 'May opening history: cycle completed', 6);
    addSeries('2026-05', 'wallet_dad', [10000, 10000, 10000, 10000, 10000], 'May opening history: cycle completed', 11);
    addSeries('2026-05', 'wallet_mom', [10000, 10000, 10000, 10000, 10000], 'May opening history: cycle completed', 16);
    events.push({
        id: 'seed_may_payment',
        date: '2026-05-31',
        type: 'card_payment',
        cardId,
        walletId: '',
        amount: 184500.75,
        fee: 0,
        chargedAmount: 0,
        transferAmount: 0,
        cashDelta: 0,
        debtDelta: 0,
        walletDelta: 0,
        note: 'May opening history: paid 184,500.75; remaining 15,000',
        createdAt: createdAt('2026-05-31')
    });

    addSeries('2026-06', 'wallet_nine', [10000, 10000, 9500.75], 'June opening progress: 2 top-ups remaining', 1);
    addSeries('2026-06', 'wallet_new', [10000, 10000, 10000, 10000, 10000], 'June opening progress: completed', 4);
    addSeries('2026-06', 'wallet_dad', [10000, 10000, 10000, 10000], 'June opening progress: 1 top-up remaining', 9);
    addSeries('2026-06', 'wallet_mom', [10000, 10000, 10000, 10000, 10000], 'June opening progress: completed', 13);

    window.CASHFLOW_LOCAL_SEED = {
        catalogVersion: 3,
        retiredCardIds: ['aeon_yca_a', 'aeon_yca', 'uob_cashplus', 'kast_kast', 'ether_ether'],
        activeMonth: '2026-06',
        settings: {
            bankCash: 65000,
            monthlyIncome: 0,
            monthlySpending: 0,
            otherReserved: 0,
            revolvingTarget: 200000,
            walletCapacity: 50000,
            feeFixed: 10,
            feePercent: 0.15
        },
        cards: [
            card(cardId, 'CARD X', 'FAMILY PLUS', 5, 25, 200000, 'cardx_shared', 1, { outstanding:152500, rollover:true }),
            card('cardx_jcb', 'CARD X', 'JCB', 5, 25, 0, 'cardx_shared', 2),
            card('ktc_unionpay', 'KTC', 'Unionpay', 6, 22, 220000, 'ktc_unionpay', 3),
            card('aeon_rabbit', 'AEON', 'RABBIT', 9, 2, 200000, 'aeon_main', 4),
            card('aeon_next_gen', 'AEON', 'NEXT GEN', 9, 2, 0, 'aeon_main', 5),
            card('aeon_wellness', 'AEON', 'WELLNESS', 9, 2, 0, 'aeon_main', 6),
            card('aeon_primo', 'AEON', 'PRIMO', 9, 2, 0, 'aeon_main', 7),
            card('bbl_shopee', 'BBL', 'SHOPEE', 9, 25, 110000, 'bbl_shared', 10),
            card('bbl_airasia', 'BBL', 'AirAsia', 9, 25, 0, 'bbl_shared', 11),
            card('bbl_m_live', 'BBL', 'M Live', 9, 25, 0, 'bbl_shared', 12),
            card('uob_tmrw', 'UOB', 'TMRW', 25, 16, 266000, 'uob_shared', 13),
            card('uob_preferred', 'UOB', 'PREFERRED', 25, 16, 0, 'uob_shared', 14),
            card('uob_one', 'UOB', 'ONE', 25, 16, 0, 'uob_shared', 15),
            card('uob_lazada', 'UOB', 'LAZADA', 25, 16, 0, 'uob_shared', 16),
            card('uob_world', 'UOB', 'WORLD', 25, 16, 0, 'uob_shared', 17),
            card('uob_premier', 'UOB', 'PREMIER', 25, 16, 0, 'uob_shared', 18),
            card('uob_simple', 'UOB', 'SIMPLE', 25, 16, 0, 'uob_shared', 19),
            card('bay_kfc', 'BAY', 'KFC', 26, 14, 108000, 'bay_kfc', 21),
            card('bay_t1', 'BAY', 'T1', 26, 14, 64000, 'bay_t1', 22),
            card('bay_lotus', 'BAY', 'LOTUS', 26, 14, 96000, 'bay_lotus', 23),
            card('bay_now', 'BAY', 'NOW', 31, 19, 32000, 'bay_now', 24),
            card('ttb_so_smart', 'TTB', 'SO SMART', 26, 16, 264000, 'ttb_so_smart', 25)
        ],
        wallets: [
            { id: 'wallet_nine', name: 'Nine', balance: 29500.75, capacity: 49500.75, active: true },
            { id: 'wallet_new', name: 'New', balance: 0, capacity: 50000, active: true },
            { id: 'wallet_dad', name: 'Dad', balance: 40000, capacity: 50000, active: true },
            { id: 'wallet_mom', name: 'Mom', balance: 0, capacity: 50000, active: true }
        ],
        events
    };
})();
