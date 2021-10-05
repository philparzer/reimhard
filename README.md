

<img src="/assets/img/banner.png">


***IMPORTANT: Reimhard is currently in early-stage testing***

## dropping 🔥 rhymes since 1170

Reimhard is a discord bot that allows you to host text-to-speech-powered rap battles without ever leaving your favorite server.


## Game Loop

1.  > after you start the game, Reimhard sends a prompt (2 verses) to all players; this marks the start of the first round
2.  > Players need to complete their prompt by coming up with 2 more verses
3.  > When time's up, Reimhard splits the players into groups of two
4.  > Here's where the rap battle part begins; Reimhard plays each player's entry in voice; other players and server members can vote
5.  > The votes earned are added to their overall score
6.  > After every player has completed their rap battle, Round 1 is over
7.  > The game continues until the last round is over, then Reimhard declares a winner and posts the scoreboard in chat

## How it works

Reimhard currently uses Google Translate's TTS API to convert the completed prompt to mp3. 
FFMPEG filters are used to overlay the beat. 
Prompts are generated using a version of GPT-2-simple retrained on hip-hop lyrics.
During the game, prompts are randomly chosen from the pregenerated GPT-2 output text file.



## Possible features further down the line
- [ ] Different eras/settings not just modern-day hip-hop (planned e.g. Shakespearean / Medieval,...)
- [ ] Google Wavenet / Amazon Polly voices
- [ ] Different language prompts
- [ ] More .txt prompt drops generated from other artists
- [ ] Customization (unlockables, )



___
heavily inspired by Mad Verse City, go give it a try https://www.jackboxgames.com/mad-verse-city/
