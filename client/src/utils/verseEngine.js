export const getSuggestedVerse = (category, requestText) => {
    const text = (requestText || '').toLowerCase();

    // Keyword based matches take priority for high relevance
    if (text.includes('fear') || text.includes('anxiety') || text.includes('worried') || text.includes('panic')) {
        return "Philippians 4:6-7 - 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.'";
    }
    if (text.includes('strength') || text.includes('weak') || text.includes('tired') || text.includes('exhausted')) {
        return "Isaiah 40:31 - 'But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.'";
    }
    if (text.includes('peace') || text.includes('rest') || text.includes('troubled') || text.includes('stress')) {
        return "John 14:27 - 'Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.'";
    }
    if (text.includes('job') || text.includes('work') || text.includes('career') || text.includes('interview')) {
        return "Proverbs 16:3 - 'Commit to the LORD whatever you do, and he will establish your plans.'";
    }
    if (text.includes('exam') || text.includes('school') || text.includes('study') || text.includes('wisdom')) {
        return "James 1:5 - 'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.'";
    }
    if (text.includes('heartbreak') || text.includes('broken') || text.includes('sad') || text.includes('grief')) {
        return "Psalm 34:18 - 'The LORD is close to the brokenhearted and saves those who are crushed in spirit.'";
    }
    if (text.includes('sick') || text.includes('disease') || text.includes('cancer') || text.includes('hospital')) {
        return "Jeremiah 17:14 - 'Heal me, Lord, and I will be healed; save me and I will be saved, for you are the one I praise.'";
    }
    if (text.includes('lost') || text.includes('confused') || text.includes('decision')) {
        return "Proverbs 3:5-6 - 'Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.'";
    }
    if (text.includes('forgive') || text.includes('sin') || text.includes('guilt')) {
        return "1 John 1:9 - 'If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.'";
    }
    if (text.includes('marriage') || text.includes('husband') || text.includes('wife')) {
        return "Ephesians 4:2 - 'Be completely humble and gentle; be patient, bearing with one another in love.'";
    }

    // Category based fallbacks
    switch (category?.toLowerCase()) {
        case 'healing':
            return "James 5:15 - 'And the prayer offered in faith will make the sick person well; the Lord will raise them up.'";
        case 'family':
            return "Joshua 24:15 - 'But as for me and my household, we will serve the LORD.'";
        case 'finances':
            return "Philippians 4:19 - 'And my God will meet all your needs according to the riches of his glory in Christ Jesus.'";
        case 'guidance':
            return "Psalm 32:8 - 'I will instruct you and teach you in the way you should go; I will counsel you with my loving eye on you.'";
        case 'thanksgiving':
            return "1 Thessalonians 5:18 - 'Give thanks in all circumstances; for this is God's will for you in Christ Jesus.'";
        default:
            return "Romans 8:28 - 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.'";
    }
};
