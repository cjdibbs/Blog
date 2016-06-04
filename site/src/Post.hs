{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE DeriveGeneric #-}

module Post where

import Data.Aeson 
import GHC.Generics
import Data.Text.Lazy (Text, pack)
import qualified Data.ByteString.Lazy as B
import System.Directory
import Data.Maybe (catMaybes)
import Data.List (isSuffixOf)


data Summary = Summary {
    tags :: [Text],
    summary :: Maybe Text,
    title :: Maybe Text,
    date :: Maybe Text,
    problem :: Maybe Text
} deriving (Generic, Show)

instance ToJSON Summary

instance FromJSON Summary

postsDir :: String
postsDir = "posts/"

getSummery :: FilePath -> IO(Maybe Summary)
getSummery file = do
    c <- B.readFile ( postsDir ++ file )
    return $ parseSummery file $ decode c
    
parseSummery :: String -> Maybe Summary -> Maybe Summary 
parseSummery f (Just s)  = Just $ setFileAndDate f s
parseSummery _ Nothing = Nothing
    
setFileAndDate :: String -> Summary -> Summary
setFileAndDate filename Summary {tags = g, summary = s, title = _, date = _, problem = p} = Summary g s t d p
    where d = Just $ pack $ takeWhile (/= '-') filename
          t = Just $ pack $ takeWhile (/= '.') $ drop 1 $ dropWhile (/= '-') filename
    
getSummereies :: IO([Summary])
getSummereies = do
    files <- getDirectoryContents postsDir
    summeries <- sequence $ map getSummery (filter isJson files)
    return $ catMaybes summeries
    where isJson = isSuffixOf ".json"
