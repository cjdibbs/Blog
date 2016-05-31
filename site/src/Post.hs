{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE DeriveGeneric #-}


module Post where

import Data.Aeson 
import GHC.Generics
--import Data.Text
import Data.Text.Lazy (Text)
import qualified Data.ByteString.Lazy as B
import System.Directory
import Data.Maybe (catMaybes)
import Data.List (isSuffixOf)

data Summary = Summary {
    tags :: [Text],
    summary :: Maybe Text,
    path :: Maybe Text,
    problem :: Maybe Text
} deriving (Generic, Show)

instance ToJSON Summary

instance FromJSON Summary

postsDir :: String
postsDir = "posts/"

getSummery :: FilePath -> IO(Maybe Summary)
getSummery file = do
    c <- B.readFile ( postsDir ++ file )
    return $ decode c -- todo use len to set path...
    
getSummereies :: IO([Summary])
getSummereies = do
    files <- getDirectoryContents postsDir
    summeries <- sequence $ map getSummery (filter isJson files)
    return $ catMaybes summeries
    where isJson = isSuffixOf ".json"
