{-# LANGUAGE OverloadedStrings #-}
module Main where

import Snap.Core
import Snap.Util.FileServe
import Snap.Http.Server
import Data.ByteString
import Data.ByteString.UTF8 (toString)
import Control.Applicative
import Data.Maybe

main :: IO ()
main = quickHttpServe site

site :: Snap ()
site = 
    route [ ("posts/:date/:title", getPost)
          ] <|>
    serveDirectory "static"

getPost :: Snap ()
getPost = do
    date <- getParam "date"
    title <- getParam "title"
    respondWithPost date title

failWith404 = do
    modifyResponse $ setResponseStatus 404 "File Not Found"
    r <- getResponse
    finishWith r    

respondWithPost :: Maybe ByteString -> Maybe ByteString -> Snap ()
respondWithPost _       Nothing = failWith404
respondWithPost Nothing _       = failWith404
respondWithPost (Just d)  (Just t)  = sendFile ("posts/" ++ (toString d) ++ " - " ++ (toString t) ++ ".json")