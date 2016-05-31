{-# LANGUAGE OverloadedStrings #-}
module Main where

import Snap.Core
import Snap.Util.FileServe
import Snap.Http.Server
import Data.ByteString
import Data.ByteString.UTF8 (toString)
import Control.Applicative
import Post (getSummereies, getBody)
import Data.Aeson (encode)
import Control.Monad.IO.Class (liftIO)

main :: IO ()
main = quickHttpServe site

site :: Snap ()
site = 
    route [ ("posts/:date/:title", method GET getPost)
          , ("posts", method GET respondWithSummeries)
          ] <|>
    serveDirectory "static"

getPost :: Snap ()
getPost = do
    date <- getParam "date"
    title <- getParam "title"
    respondWithPost date title

failWith404 :: Snap()
failWith404 = do
    modifyResponse $ setResponseStatus 404 "File Not Found"
    r <- getResponse
    finishWith r    

respondWithSummeries :: Snap()
respondWithSummeries = do
    summeries <- liftIO $ getSummereies
    writeLBS $ encode summeries

respondWithPost :: Maybe ByteString -> Maybe ByteString -> Snap ()
respondWithPost _       Nothing = failWith404
respondWithPost Nothing _       = failWith404
respondWithPost (Just d)  (Just t)  = do
    body <- liftIO $ getBody ((toString d) ++ "-" ++ (toString t) ++ ".json")
    maybe failWith404 (writeLBS . encode) body