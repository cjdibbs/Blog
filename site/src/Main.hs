{-# LANGUAGE OverloadedStrings #-}
module Main where

import Snap.Core
import Snap.Util.FileServe
import Snap.Http.Server
import qualified Data.ByteString as B
import qualified Data.ByteString.Lazy as LBS
import Data.ByteString.UTF8 (toString)
import Control.Applicative
import Post (Summary, getSummereies, date, title)
import Data.Aeson (encode)
import Control.Monad.IO.Class (liftIO)
import Data.Maybe (fromJust)
import qualified Data.Text.Lazy as T
import Data.Text.Lazy.Encoding

main :: IO ()
main = quickHttpServe site

site :: Snap ()
site = 
    route [ ("posts/:date/:title", method GET getPost)
          , ("posts", method GET respondWithSummeries)
          , ("sitemap", method GET siteMap)
          , ("post/:date/:title", method GET redirectToPost)
          ] <|>
    serveDirectory "static"



getPost :: Snap ()
getPost = do
    d <- getParam "date"
    t <- getParam "title"
    respondWithPost d t

failWith404 :: Snap()
failWith404 = do
    modifyResponse $ setResponseStatus 404 "File Not Found"
    r <- getResponse
    finishWith r    

respondWithSummeries :: Snap()
respondWithSummeries = do
    summeries <- liftIO $ getSummereies
    writeLBS $ encode summeries

respondWithPost :: Maybe B.ByteString -> Maybe B.ByteString -> Snap ()
respondWithPost _       Nothing = failWith404
respondWithPost Nothing _       = failWith404
respondWithPost (Just d)  (Just t)  = sendFile ("posts/" ++ (toString d) ++ "-" ++ (toString t) ++ ".html") 

redirectToPost :: Snap ()
redirectToPost = do
    d <- getParam "date"
    t <- getParam "title"

    redirect $ B.concat ["/#post/", fromJust d, "/", fromJust t]

siteMap :: Snap()
siteMap = do
    req <-  getRequest
    summeries <- liftIO $ getSummereies

    writeLBS $ (LBS.intercalate "\n") $ toAbsolute (athority req) $ posts summeries
    where posts s = "" : map toUrl s
          toAbsolute s ps = map (\p -> LBS.append s (encodeUtf8 p)) ps
          athority r = LBS.concat ["http://", LBS.fromStrict $ rqServerName r, "/" ]
        
toUrl :: Summary -> T.Text
toUrl s = T.concat ["#post/", fromJust $ date s, "/", fromJust $ title s]